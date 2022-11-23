import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  report_id!: string;

  @Column()
  report_type!: number;

  @ManyToOne(() => User, (user) => user.user_id, {
    orphanedRowAction: 'delete',
  })
  user_id!: User;

  @ManyToOne(() => Posting, (posting) => posting.post_id, {
    orphanedRowAction: 'delete',
  })
  post_id!: Posting;
}
