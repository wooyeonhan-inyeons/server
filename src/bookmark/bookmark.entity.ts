import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  bookmark_id!: string;

  @ManyToOne(() => User, (user) => user.user_id, {
    orphanedRowAction: 'delete',
  })
  user_id!: User;

  @ManyToOne(() => Posting, (posting) => posting.post_id, {
    orphanedRowAction: 'delete',
  })
  post_id!: Posting;
}
