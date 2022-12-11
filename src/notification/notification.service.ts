import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RequestCreateNotificationDto } from './dto/RequestCreateNotification.dto';
import { UserNotFoundException } from 'src/exception/UserNotFound.exception';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //user_id에 따라 알림을 불러오는 로직 (최근 10개만 불러오도록)
  //user_id로 알림을 등록하는 로직
  //user_id, notification_id로 알림을 확인을 체크하는 로직

  // 알림 불러오기
  async loadNotifications(user_id: string) {
    const notification = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.user_id = :user_id', { user_id })
      .orderBy({ 'notification.created_at': 'DESC' })
      .limit(10);
    return notification;
  }

  // 알림 확인 체크
  async readNotification(user_id: string, notification_id: string) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });
    const notification = await this.notificationRepository.findOne({
      relations: {
        user_id: true,
      },
      where: {
        notification_id,
      },
    });

    // 유저가 없을 때
    if (user == null) throw new UserNotFoundException();

    // 업데이트
    notification.viewed = true;
    return await this.notificationRepository.save(notification);
  }

  // 알림 등록
  async push(user_id: string, data: RequestCreateNotificationDto) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });

    // 유저가 존재하지 않을때
    if (user == null) throw new UserNotFoundException();

    // 알림 등록
    const notification = this.notificationRepository.create({
      user_id: user,
      message: data.message,
      viewed: data.viewed,
      type: data.type,
    });

    return await this.notificationRepository.save(notification);
  }
}
