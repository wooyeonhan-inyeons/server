import {Entity, PrimaryColumn,ManyToOne,JoinColumn} from 'typeorm';
import {Posting} from 'src/posting/posting.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class User_bookmarks{
    @PrimaryColumn("uuid")
    bookmark_id: string;

    @ManyToOne(() => User)
    @JoinColumn(
        {name: "user_id", referencedColumnName: "user_id"}
    )
    user4: User;

    @ManyToOne(() => Posting)
    @JoinColumn(
        {name: "post_id", referencedColumnName: "post_id"}
    )
    posting2: Posting;

}

