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

  @ManyToOne(() => Posting, (posting) => posting.image, {
    onDelete: "CASCADE",
  })
  //   @JoinColumn({ name: 'post_id', referencedColumnName: 'post_id' })
  post_id!: Posting;

  @Column()
  img_url!: string;
}
