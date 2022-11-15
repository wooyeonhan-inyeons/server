import {Entity, Column, PrimaryColumn, ManyToOne, JoinColumn} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Friends{
    @PrimaryColumn("uuid")
    friend_id: string;

    /*@ManyToOne(() => User, (user) => user.user_id)
    @JoinColumn(
        user: User;
    )*/

    @ManyToOne(() => User)
    @JoinColumn(
        {name: "friend_one", referencedColumnName: "user_id"}
    )
    user1: User;
    

    @ManyToOne(() => User)
    @JoinColumn(
        {name: "friend_two", referencedColumnName: "user_id"}
    )
    user2: User;

    @Column()
    relation_type: number;


}


