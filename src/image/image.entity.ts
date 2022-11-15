import {Entity, Column, PrimaryColumn,ManyToOne,JoinColumn} from 'typeorm';
import { Posting } from 'src/posting/posting.entity';

@Entity()
export class Image{
    @PrimaryColumn("uuid")
    img_id: string;

    @ManyToOne(()=>Posting)
    @JoinColumn(
        {name: "post_id", referencedColumnName: "post_id"}
    )
    posting2: Posting;

    @Column()
    img_url: string;
}