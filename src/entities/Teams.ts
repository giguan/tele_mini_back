import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Games } from "./Games";
import { Leagues } from "./Leagues";

@Index("league_id", ["leagueId"], {})
@Entity("teams", { schema: "mini" })
export class Teams {
  @PrimaryGeneratedColumn({ type: "int", name: "team_id" })
  teamId: number;

  @Column("varchar", { name: "team_name_en", length: 255 })
  teamNameEn: string;

  @Column("varchar", { name: "team_name_kr", length: 255 })
  teamNameKr: string;

  @Column("int", { name: "league_id", nullable: true })
  leagueId: number | null;

  @Column("tinyint", {
    name: "is_active",
    nullable: true,
    width: 1,
    default: () => "'1'",
  })
  isActive: boolean | null;

  @Column("varchar", { name: "logo_path", nullable: true, length: 255 })
  logoPath: string | null;

  @Column("varchar", { name: "team_color", nullable: true, length: 7 })
  teamColor: string | null;

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

  @OneToMany(() => Games, (games) => games.awayTeam)
  games: Games[];

  @OneToMany(() => Games, (games) => games.homeTeam)
  games2: Games[];

  @ManyToOne(() => Leagues, (leagues) => leagues.teams, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "league_id", referencedColumnName: "leagueId" }])
  league: Leagues;
}
