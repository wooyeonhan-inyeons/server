import { Post } from '@nestjs/common';
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
  JoinColumn,
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

  @OneToMany(()=>Friends, (friends)=>friends.following,{
    cascade: true
  })
  follower: Friends[];

  @OneToMany(()=>Friends, (friends)=>friends.follower,{
    cascade: true
  })
  following: Friends[];

  @OneToMany(() => Emotion, (emotion) => emotion.user_id,{
    cascade: true
  })
  emotion: Emotion[];

  @OneToMany(() => Report, (report) => report.user_id,{
    cascade: true
  })
  report: Report[];

  @OneToMany(() => Footprint, (footprint) => footprint.user_id, {
    cascade: true
  })
  footprint: Footprint[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user_id, {
    cascade: true
  })
  bookmark: Bookmark[];

  @OneToMany(() => Posting, (post) => post.user_id, {
    cascade: true
  })
  post: Posting[];
}
