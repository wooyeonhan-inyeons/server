import { Body, Controller, Get, HttpStatus, InternalServerErrorException, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
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
      .loadNotifications(req.user.user_id).catch((err) => {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.messages,
        });
      });
  }

  // 알림 확인 체크
  @Post()
  @ApiOperation({
    summary: '알림을 확인했는지 체크합니다.',
  })
  @Roles([Role.User])
  async CheckRead(@Query('notification_id') notification_id: string, @Req() req) {
    return await this.notificationService
      .isRead(notification_id, req.user.user_id)
      .catch((err) => {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      });
  }


}
