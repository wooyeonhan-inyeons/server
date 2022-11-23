import { IsEmail } from 'class-validator';
import { Bookmark } from 'src/bookmark/bookmark.entity';
import { Emotion } from 'src/emotion/emotion.entity';
import { Footprint } from 'src/footprint/footprint.entity';
import { Friends } from 'src/friends/friends.entity';
import { Posting } from 'src/posting/posting.entity';
import { Report } from 'src/report/report.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id!: string;

  @Column()
  name!: string;

  @Column()
  @IsEmail({}, { message: 'Incorrect email' })
  email!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(()=>Friends, (friends)=>friends.following)
  followers: Friends[];

  @OneToMany(()=>Friends, (friends)=>friends.follower)
  following: Friends[];

  // @OneToMany(() => Emotion, (emotion) => emotion.post_id)
  // emotion_posts: Emotion[];

  // @OneToMany(() => Report, (report) => report.report_id)
  // report_posts: Report[];

  // @OneToMany(() => Footprint, (footprint) => footprint.post_id)
  // footprint: Footprint[];

  // @OneToMany(() => Bookmark, (bookmark) => bookmark.post_id)
  // bookmark_posts: Bookmark[];
}
