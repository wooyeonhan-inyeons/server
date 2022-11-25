import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Entity()
export class Footprint {
  @PrimaryGeneratedColumn('uuid')
  footprint_id!: string;

  @ManyToOne(() => User, (user) => user.footprint, {
    onDelete: "CASCADE",
  })
  user_id!: User;

  @ManyToOne(() => Posting, (posting) => posting.footprint, {
    onDelete: "CASCADE",
  })
  post_id!: Posting;
}
