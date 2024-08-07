import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Favorites } from "./Favorites";
import { Teams } from "./Teams";
import { Seasons } from "./Seasons";
import { Periods } from "./Periods";

@Index("home_team_id", ["homeTeamId"], {})
@Index("away_team_id", ["awayTeamId"], {})
@Index("season_id", ["seasonId"], {})
@Entity("games", { schema: "mini" })
export class Games {
  @PrimaryGeneratedColumn({ type: "int", name: "game_id" })
  gameId: number;

  @Column("int", { name: "season_id", nullable: true })
  seasonId: number | null;

  @Column("int", { name: "home_team_id", nullable: true })
  homeTeamId: number | null;

  @Column("int", { name: "away_team_id", nullable: true })
  awayTeamId: number | null;

  @Column("datetime", { name: "game_date", nullable: true })
  gameDate: Date | null;

  @Column("int", { name: "home_score", nullable: true })
  homeScore: number | null;

  @Column("int", { name: "away_score", nullable: true })
  awayScore: number | null;

  @Column("varchar", { name: "game_status", nullable: true, length: 50 })
  gameStatus: string | null;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", {
    name: "updated_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;

  @OneToMany(() => Favorites, (favorites) => favorites.game)
  favorites: Favorites[];

  @ManyToOne(() => Teams, (teams) => teams.games, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "away_team_id", referencedColumnName: "teamId" }])
  awayTeam: Teams;

  @ManyToOne(() => Teams, (teams) => teams.games2, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "home_team_id", referencedColumnName: "teamId" }])
  homeTeam: Teams;

  @ManyToOne(() => Seasons, (seasons) => seasons.games, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "season_id", referencedColumnName: "seasonId" }])
  season: Seasons;

  @OneToMany(() => Periods, (periods) => periods.game)
  periods: Periods[];
}
