import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Games } from 'src/entities/Games';
import { Teams } from 'src/entities/Teams';
import { Repository } from 'typeorm';

@Injectable()
export class GamesService {
    constructor(
        @InjectRepository(Games)
        private gamesRepository: Repository<Games>,

        @InjectRepository(Teams)
        private teamsRepository: Repository<Teams>,
    ) {

    }

    async getGamesList() {
        const returned = await this.gamesRepository.createQueryBuilder('g')
            .select('g.game_id', 'game_id')
            .addSelect('g.game_date', 'game_date')
            .addSelect('ht.team_name_en', 'home_team')
            .addSelect('at.team_name_en', 'away_team')
            .addSelect('g.home_score', 'home_score')
            .addSelect('g.away_score', 'away_score')
            .addSelect('o.reference_point', 'reference_point')
            .addSelect('GROUP_CONCAT(CONCAT(bt.bet_type_name, ": ", o.odds, " (", o.bet_description, ")") SEPARATOR ", ")', 'odds_details')
            .innerJoin(Teams, 'ht', 'g.home_team_id = ht.team_id')
            .innerJoin(Teams, 'at', 'g.away_team_id = at.team_id')
            .groupBy('g.game_id, o.reference_point')
            .getRawMany();

        return returned;

    }
}
