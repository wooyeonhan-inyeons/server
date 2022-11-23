import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Posting } from 'src/posting/posting.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  img_id!: string;

  @ManyToOne(() => Posting, (posting) => posting.post_id, {
    orphanedRowAction: 'delete',
  })
  //   @JoinColumn({ name: 'post_id', referencedColumnName: 'post_id' })
  posting!: Posting;

  @Column()
  img_url!: string;
}
