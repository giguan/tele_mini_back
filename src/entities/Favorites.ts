import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Games } from "./Games";

@Index("user_id", ["userId"], {})
@Index("game_id", ["gameId"], {})
@Entity("favorites", { schema: "mini" })
export class Favorites {
  @PrimaryGeneratedColumn({ type: "int", name: "favorite_id" })
  favoriteId: number;

  @Column("int", { name: "user_id" })
  userId: number;

  @Column("int", { name: "game_id" })
  gameId: number;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Users, (users) => users.favorites, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: Users;

  @ManyToOne(() => Games, (games) => games.favorites, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "game_id", referencedColumnName: "gameId" }])
  game: Games;
}
