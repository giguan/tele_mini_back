import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Periods } from 'src/entities/Periods';
import { Seasons } from 'src/entities/Seasons';

dotenv.config();

@Injectable()
export class NamedService {
    private leagueMapping: Record<number, { id: number; name: string; kr_name: string }>;
    private teamMapping: Record<number, { id: number; name: string; kr_name: string }>;

    constructor(
        @InjectRepository(Games)
        private gamesRepository: Repository<Games>,

        @InjectRepository(Periods)
        private periodsRepository: Repository<Periods>,

        @InjectRepository(Seasons)
        private seasonsRepository: Repository<Seasons>,

        private dataSource: DataSource
    ) {
        const mappingFilePath = path.resolve(process.cwd(), process.env.MAPPING_FILE_PATH);
        const mapping = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8'));
        this.leagueMapping = mapping.leagues;
        this.teamMapping = mapping.teams;
    }

    async getNamedData() {
        const dummyDataPath = path.resolve(process.cwd(), process.env.DUMMY_FILE_PATH);
        const apiData = JSON.parse(fs.readFileSync(dummyDataPath, 'utf8'));

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            for (const sportsType of Object.keys(apiData)) {
                const games = apiData[sportsType].filter(game => this.leagueMapping[game.league.id]);
                for (const game of games) {
                    if (this.teamMapping[game.teams.home.id] && this.teamMapping[game.teams.away.id]) {
                        const league = this.mapLeague(game.league.id);
                        const homeTeam = this.mapTeam(game.teams.home.id);
                        const awayTeam = this.mapTeam(game.teams.away.id);

                        // 시즌을 먼저 확인하고 시즌을 생성하는 로직 추가
                        let season = await queryRunner.manager.getRepository(Seasons).findOne({
                            where: {
                                leagueId: league.id,
                                year: new Date(game.startDatetime).getFullYear()
                            },
                            select: ['seasonId']
                        });

                        if (!season) {
                            const seasonInfo: DeepPartial<Seasons> = {
                                leagueId: league.id,
                                seasonName: `${league.name} ${new Date(game.startDatetime).getFullYear()}`,
                                year: new Date(game.startDatetime).getFullYear(),
                                startDate: new Date(game.startDatetime),
                                endDate: new Date(game.startDatetime), // 종료 날짜는 필요에 따라 업데이트
                                isActive: true
                            };
                            season = await queryRunner.manager.getRepository(Seasons).save(seasonInfo);
                        }

                        let existingGame = await queryRunner.manager.getRepository(Games).findOne({
                            where: {
                                seasonId: season.seasonId,
                                homeTeamId: homeTeam.id,
                                awayTeamId: awayTeam.id,
                                gameDate: new Date(game.startDatetime)
                            },
                            select: ['gameId']
                        });

                        if (existingGame && existingGame.gameId) {
                            console.log(`Game already exists: ${existingGame.gameId}, updating...`);
                            // Update existing game
                            existingGame.homeScore = game.teams.home.periodData.reduce((acc, curr) => acc + curr.score, 0);
                            existingGame.awayScore = game.teams.away.periodData.reduce((acc, curr) => acc + curr.score, 0);
                            existingGame.gameStatus = game.gameStatus;

                            await queryRunner.manager.getRepository(Games).save(existingGame);
                            // Delete existing periods
                            await queryRunner.manager.getRepository(Periods).delete({ gameId: existingGame.gameId });
                        } else {
                            console.log('Creating new game');
                            // Create new game
                            const gameInfo = {
                                "seasonId": season.seasonId,
                                "homeTeamId": homeTeam.id,
                                "awayTeamId": awayTeam.id,
                                "gameDate": new Date(game.startDatetime),
                                "homeScore": game.teams.home.periodData.reduce((acc, curr) => acc + curr.score, 0),
                                "awayScore": game.teams.away.periodData.reduce((acc, curr) => acc + curr.score, 0),
                                "gameStatus": game.gameStatus,
                            };

                            existingGame = await queryRunner.manager.getRepository(Games).save(gameInfo);
                            console.log(`Saved game ID: ${existingGame.gameId}`);
                        }

                        for (const period of game.teams.home.periodData) {
                            const periodEntity = {
                                "gameId": existingGame.gameId,
                                "periodNumber": period.period,
                                "homeTeamScore": period.score,
                                "awayTeamScore": game.teams.away.periodData.find(p => p.period === period.period)?.score || 0,
                            };

                            await queryRunner.manager.getRepository(Periods).save(periodEntity);
                        }
                    }
                }
            }

            await queryRunner.commitTransaction();
        } catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getGamesList() {
        const query = `
            SELECT
                g.gameId,
                s.season_name AS seasonName,
                ht.team_name_en AS homeTeamName,
                at.team_name_en AS awayTeamName,
                g.gameDate,
                g.homeScore,
                g.awayScore,
                g.gameStatus
            FROM
                Games g
                JOIN Teams ht ON g.homeTeamId = ht.team_id
                JOIN Teams at ON g.awayTeamId = at.team_id
                JOIN Seasons s ON g.seasonId = s.season_id
            ORDER BY
                g.gameDate DESC;
        `;

        const games = await this.dataSource.query(query);
        return games;
    }

    mapLeague(apiLeagueId: number): { id: number; name: string; kr_name: string } {
        return this.leagueMapping[apiLeagueId] || null;
    }

    mapTeam(apiTeamId: number): { id: number; name: string; kr_name: string } {
        return this.teamMapping[apiTeamId] || null;
    }
}
