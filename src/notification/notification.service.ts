import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { RequestCreateNotificationDto } from './dto/RequestCreateNotification.dto';

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

  // 알림 불러오기
  async loadNotifications(user_id: string) {
    const notification = await this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin(User, 'user', 'user.user_id = notification.user_id')
      .where('notification.user_id = :user_id', { user_id })
      .limit(10);

    return notification;
  }

  // 알림 확인 체크
  async readNotification(notification_id: string, user_id: string) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });
    const notification_ = await this.notificationRepository
      .createQueryBuilder('notification')
      .where('notification.notification_id = :notification_id', { notification_id })
      .getOne();

    // 유저나 알림이 없을 때
    if (user == null) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '유저가 존재하지 않습니다.',
      });
    }
    if (notification_ == null) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '알림이 존재하지 않습니다.',
      });
    }

    const isMine = await this.notificationRepository
      .createQueryBuilder('notification')
      .innerJoin(User, 'user', 'notification.user_id = user.user_id')
      .where('notification.user_id = :user_id', { user_id })
      .andWhere('notification.notification_id = :notification_id', { notification_id })
      .getOne();

    // 알림이 요청한 유저의 것이 아닐 때
    if (isMine == null) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '잘못된 요청입니다.',
      });
    }

    const isRead = await this.notificationRepository
      .createQueryBuilder('notification')
      .select('viewed')
      .where('notification.notification_id = :notification_id', { notification_id })
      .andWhere('notification.user_id = :user_id', { user_id })
      .getOne();

    // 이미 읽은 알림일 때
    if (isRead) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '이미 읽은 알림입니다.',
      });
    }

    // 업데이트

  }

  // 알림 등록
  async push(user_id: string) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });

    // 유저가 존재하지 않을때
    if (user == null) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '유저가 존재하지 않습니다.',
      });
    }

    // 알림 등록

  }
}
