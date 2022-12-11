import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Entity()
export class Emotion {
  @PrimaryGeneratedColumn('uuid')
  emotion_id!: string;

  @Column()
  emotion_type!: number;

  @ManyToOne(() => User, (user) => user.emotion, {
    onDelete: 'CASCADE',
  })
  user_id!: User;

  @ManyToOne(() => Posting, (posting) => posting.emotion, {
    onDelete: 'CASCADE',
  })
  post_id!: Posting;

  @CreateDateColumn()
  created_at!: Date;
}
