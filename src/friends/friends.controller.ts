import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestDeclineFriendDto } from './dto/RequestDeclineFriend.dto';
import { RequestAcceptFriendDto } from './dto/RequestAcceptFriend.dto';
import { RequestCreateFriendDto } from './dto/RequestCreateFriend.dto';
import { RequestDeleteFriendDto } from './dto/RequestDeleteFriend.dto';
import { ResponseCreateFriendDto } from './dto/ResponseCreateFriend.dto';
import { ResponseGetAllFriendDto } from './dto/ResponseGetAllFriend.dto';
import { ResponseGetFriendRequestDto } from './dto/ResponseGetFriendRequest.dto';
import { ResponseGetRequestFriendListDto } from './dto/ResponseGetRequestFriendList.dto';
import { FriendsService } from './friends.service';

@ApiTags('friends')
@ApiBearerAuth()
@Controller('friends')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  @ApiCreatedResponse({
    status: 200,
    type: ResponseCreateFriendDto,
    description: '친구 신청을 합니다.',
  })
  @Roles([Role.User])
  async create(@Req() req, @Body() body: RequestCreateFriendDto) {
    return await this.friendsService
      .createRelation(req.user.user_id, body.following_id)
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Get()
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetAllFriendDto,
    description: '모든 친구를 조회합니다.',
  })
  @Roles([Role.User])
  async getAllFriend(@Req() req) {
    return await this.friendsService
      .getFriendsList(req.user.user_id)
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Post('/accept')
  @Roles([Role.User])
  async acceptFriendRequest(@Req() req, @Body() body: RequestAcceptFriendDto) {
    return await this.friendsService
      .acceptFriendRequest(req.user.user_id, body.friend_id)
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Post('/decline')
  @Roles([Role.User])
  async declineFriendRequest(
    @Req() req,
    @Body() body: RequestDeclineFriendDto,
  ) {
    return await this.friendsService
      .declineFriendRequest(req.user.user_id, body.friend_id)
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Get('/request')
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetFriendRequestDto,
    description: '받은 친구요청 목록을 조회합니다.',
    isArray: true,
  })
  @Roles([Role.User])
  async getFriendRequest(@Req() req) {
    return await this.friendsService
      .getFriendRequestList(req.user.user_id)
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Get('/requested')
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetRequestFriendListDto,
    description: '보낸 친구요청 목록을 조회합니다.',
    isArray: true,
  })
  @Roles([Role.User])
  async getRequestedFriendList(@Req() req) {
    return await this.friendsService
      .getRequestedFriendList(req.user.user_id)
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  @Delete()
  @Roles([Role.User])
  async deleteFriend(@Req() req, @Body() body: RequestDeleteFriendDto) {
    return await this.friendsService
      .deleteFriend(req.user.user_id, body.friend_id)
      .catch((err) => {
        throw new HttpException(
          {
            message: err.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      });
  }
}
