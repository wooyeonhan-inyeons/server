import {Entity, Column, PrimaryColumn, ManyToMany, JoinColumn} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Entity()
export class Footprint{
    @PrimaryColumn("uuid")
    footprint_id: string;

    @ManyToMany(()=>User)
    @JoinColumn(
        {name: "user_id", referencedColumnName: "user_id"}
    )
    user: User;

    @ManyToMany(()=>Posting)
    @JoinColumn(
        {name: "post_id", referencedColumnName: "post_id"}
    )
    posting: Posting;
}

