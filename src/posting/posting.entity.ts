import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Emotion } from 'src/emotion/emotion.entity';
import { Report } from 'src/report/report.entity';
import { Footprint } from 'src/footprint/footprint.entity';
import { Bookmark } from 'src/bookmark/bookmark.entity';
import { Image } from 'src/image/image.entity';
import { Video } from 'src/video/video.entity';

@Entity()
export class Posting {
  @PrimaryGeneratedColumn('uuid')
  post_id!: string;

  @Column('varchar', { length: 200 })
  content: string;

  @CreateDateColumn()
  created_time!: Date;

  @Column({ default: 0 })
  forFriend: number;

  @Column('double')
  latitude: number;

  @Column('double')
  longitude: number;

  @ManyToOne(() => User, (user) => user.post, {
    //유저가 삭제되면 모든 포스트는 삭제된다.
    onDelete: 'CASCADE',
    nullable: false,
  })
  user_id!: User;

  @OneToMany(() => Image, (image) => image.post_id, {
    cascade: true,
  })
  image: Image[];

  @OneToMany(() => Video, (video) => video.post_id, {
    cascade: true,
  })
  video: Video[];

  @OneToMany(() => Footprint, (footprint) => footprint.post_id, {
    cascade: true,
  })
  footprint: Footprint[];

  @OneToMany(() => Emotion, (emotion) => emotion.post_id, {
    cascade: true,
  })
  emotion: Emotion[];

  @OneToMany(() => Report, (report) => report.post_id, {
    cascade: true,
  })
  report: Report[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.post_id, {
    cascade: true,
  })
  bookmark: Bookmark[];
}
