import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  //user_id에 따라 알림을 불러오는 로직 (최근 10개만 불러오도록)
  //user_id로 알림을 등록하는 로직
  //user_id, notification_id로 알림을 확인을 체크하는 로직
  async loadNotifications(user_id: string) {

  }

  async isRead(notification_id: string, user_id: string) {

  }
}
