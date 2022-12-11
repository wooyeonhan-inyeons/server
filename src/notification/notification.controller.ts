import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestCreateNotificationDto } from './dto/RequestCreateNotification.dto';
import { RequestUpdateNotificationDto } from './dto/RequestUpdateNotification.dto';
import { NotificationService } from './notification.service';

@ApiTags('notification')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) { }
  //user_id에 따라 알림을 불러오는 Controller
  //user_id, notification_id를 받아서 알림 확인을 체크하는 로직

  // 알림 불러오기
  @Get()
  @ApiOperation({
    summary: '알림을 불러옵니다.',
  })
  @Roles([Role.User])
  async LoadNotification(@Req() req) {
    return await this.notificationService
      .loadNotifications(req.user.user_id)
      .catch((err) => {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.messages,
        });
      });
  }

  // 알림 확인 체크
  @Post('read')
  @ApiOperation({
    summary: '알림을 확인했는지 체크합니다.',
  })
  @Roles([Role.User])
  async ReadNotification(@Req() req, @Body() body: RequestUpdateNotificationDto) {
    return await this.notificationService
      .readNotification(req.user.user_id, body.notification_id)
      .catch((err) => {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      });
  }


  // 알림 등록
  @Post('push')
  @ApiOperation({
    summary: '알림을 등록합니다.',
  })
  @Roles([Role.User])
  async PushNotification(@Req() req, @Body() data: RequestCreateNotificationDto) {
    return await this.notificationService
      .push(req.user.user_id, data)
      .catch((err) => {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      });
  }
}
