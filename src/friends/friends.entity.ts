import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Friends {
  @PrimaryGeneratedColumn('uuid')
  friend_id!: string;

  /*@ManyToOne(() => User, (user) => user.user_id)
    @JoinColumn(
        user: User;
    )*/
  @ManyToOne(() => User, (user) => user.following, {
    onDelete: "CASCADE",
    orphanedRowAction: 'delete',
    nullable: false
  })
  //   @JoinColumn({ name: 'user_id_1', referencedColumnName: 'user_id' })
  follower!: User;

  @ManyToOne(() => User, (user) => user.follower, {
    onDelete: "CASCADE",
    orphanedRowAction: 'delete',
    nullable: false
  })
  //   @JoinColumn({ name: 'user_id_2', referencedColumnName: 'user_id' })
  following!: User;

  @Column()
  relation_type!: number;
}
