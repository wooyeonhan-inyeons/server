import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Posting{
    @PrimaryGeneratedColumn("uuid")
    post_id: string;

    @Column("varchar", { length: 200 })
    content: string;

    @CreateDateColumn()
    created_time: Date;

    @Column()
    footprint_count: number;

    @Column()
    good_number: number;

    @Column()
    sad_number: number;

    @Column()
    angry_number: number;
    
    @Column()
    report_count: number;
    
    @Column()
    location_id: number;

    @Column()
    forFriend: number;
    default: "0";
    
    @ManyToOne(()=>User, user=> user.user_id)
    user: User;

}


