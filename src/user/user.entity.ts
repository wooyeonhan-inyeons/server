import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';


@Entity()
export class User{
    @PrimaryGeneratedColumn("uuid")
    user_id: string;

    @Column("varchar", { length: 50 })
    name: string;

    @CreateDateColumn()
    created_at: Date;
}


