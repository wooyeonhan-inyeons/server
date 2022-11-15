import {Entity, PrimaryColumn,ManyToOne,JoinColumn, ManyToMany, OneToOne} from 'typeorm';
import {Posting} from 'src/posting/posting.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class User_bookmarks{
    @PrimaryColumn("uuid")
    bookmark_id: string;

    @OneToOne(() => User)
    @JoinColumn(
        {name: "user_id", referencedColumnName: "user_id"}
    )
    user: User;

    @ManyToMany(() => Posting)
    @JoinColumn(
        {name: "post_id", referencedColumnName: "post_id"}
    )
    posting: Posting;

}

