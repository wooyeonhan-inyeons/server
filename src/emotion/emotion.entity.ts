import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Entity()
export class Emotion {
  @PrimaryGeneratedColumn('uuid')
  emotion_id!: string;

  @Column()
  emotion_type!: number;

  @ManyToOne(() => User, (user) => user.user_id, {
    orphanedRowAction: 'delete',
  })
  user_id!: User;

  @ManyToOne(() => Posting, (posting) => posting.post_id, {
    orphanedRowAction: 'delete',
  })
  post_id!: Posting;
}
