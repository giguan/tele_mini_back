import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({schema: 'named', name: 'namedmatch'})
export class Match {

    @PrimaryGeneratedColumn({type: 'int', name: 'id'})
    id: number;

    @Column({type: 'longtext', name: 'data'})
    data: string;

    @CreateDateColumn()
    createdAt: Date;
}