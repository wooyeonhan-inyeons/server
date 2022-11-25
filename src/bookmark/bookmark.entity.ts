import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn('uuid')
  bookmark_id!: string;

  @ManyToOne(() => User, (user) => user.bookmark, {
    onDelete: "CASCADE",
  })
  user_id!: User;

  @ManyToOne(() => Posting, (posting) => posting.bookmark, {
    onDelete: "CASCADE",
  })
  post_id!: Posting;
}
