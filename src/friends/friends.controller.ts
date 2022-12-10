import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: '친구 신청을 합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseCreateFriendDto,
  })
  @Roles([Role.User])
  async create(@Req() req, @Body() body: RequestCreateFriendDto) {
    return await this.friendsService.createRelation(
      req.user.user_id,
      body.following_id,
    );
  }

  @Get()
  @ApiOperation({
    summary: '모든 친구를 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetAllFriendDto,
  })
  @Roles([Role.User])
  async getAllFriend(@Req() req) {
    return await this.friendsService.getFriendsList(req.user.user_id);
  }

  @Post('/accept')
  @ApiOperation({
    summary: '친구요청을 수락합니다.',
  })
  @Roles([Role.User])
  async acceptFriendRequest(@Req() req, @Body() body: RequestAcceptFriendDto) {
    return await this.friendsService.acceptFriendRequest(
      req.user.user_id,
      body.friend_id,
    );
  }

  @Post('/decline')
  @ApiOperation({
    summary: '친구요청을 거절합니다.',
  })
  @Roles([Role.User])
  async declineFriendRequest(
    @Req() req,
    @Body() body: RequestDeclineFriendDto,
  ) {
    return await this.friendsService.declineFriendRequest(
      req.user.user_id,
      body.friend_id,
    );
  }

  @Get('/request')
  @ApiOperation({
    summary: '받은 친구요청 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetFriendRequestDto,
    isArray: true,
  })
  @Roles([Role.User])
  async getFriendRequest(@Req() req) {
    return await this.friendsService.getFriendRequestList(req.user.user_id);
  }

  @Get('/requested')
  @ApiOperation({
    summary: '보낸 친구요청 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetRequestFriendListDto,
    isArray: true,
  })
  @Roles([Role.User])
  async getRequestedFriendList(@Req() req) {
    return await this.friendsService.getRequestedFriendList(req.user.user_id);
  }

  @Delete()
  @ApiOperation({
    summary: '친구를 삭제합니다.',
  })
  @Roles([Role.User])
  async deleteFriend(@Req() req, @Body() body: RequestDeleteFriendDto) {
    return await this.friendsService.deleteFriend(
      req.user.user_id,
      body.friend_id,
    );
  }
}
