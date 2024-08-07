import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Favorites } from "./Favorites";

@Index("unique_tele_id", ["teleId"], { unique: true })
@Index("IDX_2db62d5e5122c8cf3f6082029e", ["teleId"], { unique: true })
@Entity("users", { schema: "mini" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "first_name", length: 255 })
  firstName: string;

  @Column("varchar", { name: "last_name", length: 255 })
  lastName: string;

  @Column("datetime", {
    name: "createdAt",
    default: () => "'current_timestamp(6)'",
  })
  createdAt: Date;

  @Column("datetime", { name: "updatedAt", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column("varchar", { name: "tele_id", unique: true, length: 255 })
  teleId: string;

  @Column("int", { name: "money" })
  money: number;

  @OneToMany(() => Favorites, (favorites) => favorites.user)
  favorites: Favorites[];
}
