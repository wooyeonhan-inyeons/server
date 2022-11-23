import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Emotion } from 'src/emotion/emotion.entity';
import { Report } from 'src/report/report.entity';
import { Footprint } from 'src/footprint/footprint.entity';
import { Point } from 'wkx';
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

  @Column({ type: 'point' })
  location_coord!: Point;

  @ManyToOne(() => User, (user) => user.user_id, {
    //유저가 삭제되면 모든 포스트는 삭제된다.
    orphanedRowAction: 'delete',
  })
  user!: User;

  @OneToMany(() => Image, (image) => image.img_url, {
    cascade: true,
  })
  image_urls: Image[];

  @OneToMany(() => Video, (video) => video.video_url, {
    cascade: true,
  })
  video_urls: Video[];

  @OneToMany(() => Footprint, (footprint) => footprint.user_id, {
    cascade: true,
  })
  footprint: Footprint[];

  @OneToMany(() => Emotion, (emotion) => emotion.user_id, {
    cascade: true,
  })
  emotion_users: Emotion[];

  @OneToMany(() => Report, (report) => report.user_id, {
    cascade: true,
  })
  report_users: Report[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user_id, {
    cascade: true,
  })
  bookmark_users: Bookmark[];
}
