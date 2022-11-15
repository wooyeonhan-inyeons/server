import {Entity, Column, PrimaryColumn, CreateDateColumn} from 'typeorm';


@Entity()
export class User{
    @PrimaryColumn("uuid")
    user_id: string;

    @Column("varchar", { length: 50 })
    name: string;

    @CreateDateColumn()
    created_at: Date;
}


