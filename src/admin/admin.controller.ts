import {
  Controller,
  Get,
  UseGuards,
  Request,
  Delete,
  Body,
  Query,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { RequestCreateUserDto } from '../user/dto/RequestCreateUser.dto';
import { RequestUpdateUserDto } from 'src/user/dto/RequestUpdateUser.dto';
import { ResponseReadUserDto } from './dto/ResponseReadUser.dto';
import { ResponseGetUserATDto } from './dto/ResponseGetUserAT.dto';
import { FriendsService } from 'src/friends/friends.service';
import { RequestUpdateFriendRelationDto } from './dto/RequestUpdateFriendRelation.dto';
import { RequestDeleteUserDto } from './dto/ReqeustDeleteUser.dto';
import { ResponseGetAllFriendByAdminDto } from './dto/ResponseGetAllFriendByAdmin.dto';
import { ResponseReadAllUserDto } from './dto/ResponseReadAllUser.dto';

@ApiTags('admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private userService: UserService,
    private friendsService: FriendsService,
  ) {}

  @Get('/all')
  @Roles([Role.Admin])
  async login(@Request() req) {
    return await this.adminService.findAll();
  }

  // 생성
  @Post('/user')
  @Roles([Role.Admin])
  async createUser(@Body() createUserData: RequestCreateUserDto) {
    return await this.userService.create(createUserData);
  }

  // 조회
  @Get('/user/all')
  @ApiCreatedResponse({
    status: 200,
    type: ResponseReadAllUserDto,
    isArray: true,
  })
  @Roles([Role.Admin])
  async getUserAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/user')
  @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto })
  @Roles([Role.Admin])
  async getUser(@Query('user_id') userID: string) {
    return await this.userService.findOne(userID);
  }

  @Get('/userAT')
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserATDto,
    description: '해당 유저의 access_token을 얻을수있습니다.',
  })
  @Roles([Role.Admin])
  async getUserAT(@Query('user_id') userID: string) {
    return await this.adminService.getUserAccessToken(userID);
  }

  // 수정
  @Patch('/user')
  @Roles([Role.Admin])
  async patchUser(@Body() body: RequestUpdateUserDto) {
    return await this.userService.update(body.user_id, body);
  }

  // 삭제
  @Delete('/user')
  @Roles([Role.Admin])
  async removeUser(@Body() body: RequestDeleteUserDto) {
    return await this.userService.delete(body.user_id);
  }

  @Get('/friends/all')
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetAllFriendByAdminDto,
    description: '모든 친구 요청 목록을 조회합니다.',
    isArray: true,
  })
  @Roles([Role.Admin])
  async getAllFriendList() {
    return await this.friendsService.getAllFriendList();
  }

  @Patch('/friends')
  @ApiCreatedResponse({
    status: 200,
    description: '친구 목록에서 관계를 수정합니다.',
  })
  @Roles([Role.Admin])
  async updateFriendRelation(@Body() body: RequestUpdateFriendRelationDto) {
    return await this.friendsService.updateRelation(
      body.friend_id,
      body.relation_type,
    );
  }

  @Delete('/friends')
  @ApiCreatedResponse({
    status: 200,
    description: '특정 친구 관계를 삭제합니다.',
  })
  @Roles([Role.Admin])
  async deleteFriendRelation(@Body() body: RequestUpdateFriendRelationDto) {
    return await this.friendsService.deleteFriendByFriendId(body.friend_id);
  }
}
