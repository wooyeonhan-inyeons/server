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

  @ManyToOne(() => Posting, (posting) => posting.post_id, {
    orphanedRowAction: 'delete',
  })
  //   @JoinColumn({ name: 'post_id', referencedColumnName: 'post_id' })
  posting!: Posting;

  @Column()
  video_url!: string;
}
