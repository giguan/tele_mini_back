import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({schema: 'named', name: 'users'})
export class Users {

    @PrimaryGeneratedColumn({type: 'int', name: 'id'})
    id: number;

    @Column({type: 'varchar', name: 'tele_id'})
    tele_id: string;

    @Column({type: 'varchar', name: 'first_name'})
    first_name: string;

    @Column({type: 'varchar', name: 'last_name'})
    last_name: string;

    @Column({type: 'int', name: 'money'})
    money: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}