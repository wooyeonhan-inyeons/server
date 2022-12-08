import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  notification_id!: string;

  @ManyToOne(() => User, (user) => user.notification, {
    onDelete: 'CASCADE',
  })
  user_id!: User;

  @Column()
  message!: string;

  @Column()
  /*
   확인 여부
  */
  viewed!: boolean;

  @Column()
  /*
    0: 친구 요청
    1: 친구 요청 받음
  */
  type!: number;
}
