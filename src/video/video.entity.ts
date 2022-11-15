import {Entity, Column, PrimaryColumn,ManyToOne,JoinColumn} from 'typeorm';
import { Posting } from 'src/posting/posting.entity';

@Entity()
export class Video{
    @PrimaryColumn("uuid")
    video_id: string;

    @ManyToOne(()=>Posting)
    @JoinColumn(
        {name: "post_id", referencedColumnName: "post_id"}
    )
    posting: Posting;

    @Column()
    video_url: string;
}