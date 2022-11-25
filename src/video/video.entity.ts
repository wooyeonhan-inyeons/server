import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Posting } from 'src/posting/posting.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  video_id!: string;

  @ManyToOne(() => Posting, (posting) => posting.video, {
    onDelete: "CASCADE",
  })
  //   @JoinColumn({ name: 'post_id', referencedColumnName: 'post_id' })
  post_id!: Posting;

  @Column()
  video_url!: string;
}
