import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({schema: 'named', name: 'namedjson'})
export class NamedJson {

    @PrimaryGeneratedColumn({type: 'int', name: 'id'})
    id: number;

    @Column({type: 'longtext', name: 'data'})
    data: string;

    @CreateDateColumn()
    createdAt: Date;
}