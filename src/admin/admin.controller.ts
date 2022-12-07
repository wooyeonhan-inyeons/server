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
import { PostingService } from 'src/posting/posting.service';
import { RequestUpdatePostDto } from './dto/RequestUpdatePost.dto';
import { RequestDeletePostDto } from './dto/RequestDeletePost.dto';
import { ResponseGetAllPostDto } from './dto/ResponseGetAllPost.dto';

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
    private postingService: PostingService,
  ) {}

  @Get('/all')
  @ApiOperation({
    summary: '모든 어드민을 조회합니다.',
  })
  @Roles([Role.Admin])
  async login(@Request() req) {
    return await this.adminService.findAll();
  }

  /* User 제어 */

  // 생성
  @Post('/user')
  @ApiOperation({
    summary: '새로운 유저를 생성합니다.',
  })
  @Roles([Role.Admin])
  async createUser(@Body() createUserData: RequestCreateUserDto) {
    return await this.userService.create(createUserData);
  }

  // 조회
  @Get('/user/all')
  @ApiOperation({
    summary: '모든 유저를 조회합니다.',
  })
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
  @ApiOperation({
    summary: '특정 유저를 조회합니다.',
  })
  @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto })
  @Roles([Role.Admin])
  async getUser(@Query('user_id') userID: string) {
    return await this.userService.findOne(userID);
  }

  @Get('/userAT')
  @ApiOperation({
    summary: '특정 유저의 access_token을 얻을 수 있습니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserATDto,
  })
  @Roles([Role.Admin])
  async getUserAT(@Query('user_id') userID: string) {
    return await this.adminService.getUserAccessToken(userID);
  }

  // 수정
  @Patch('/user')
  @ApiOperation({
    summary: '특정 유저 정보를 수정합니다.',
  })
  @Roles([Role.Admin])
  async patchUser(@Body() body: RequestUpdateUserDto) {
    return await this.userService.update(body.user_id, body);
  }

  // 삭제
  @Delete('/user')
  @ApiOperation({
    summary: '특정 유저를 삭제합니다.',
  })
  @Roles([Role.Admin])
  async removeUser(@Body() body: RequestDeleteUserDto) {
    return await this.userService.delete(body.user_id);
  }

  /* Friends 제어 */

  @Get('/friends/all')
  @ApiOperation({
    summary: '모든 친구 관계를 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetAllFriendByAdminDto,
    isArray: true,
  })
  @Roles([Role.Admin])
  async getAllFriendList() {
    return await this.friendsService.getAllFriend_Admin();
  }

  @Patch('/friends')
  @ApiOperation({
    summary: '친구 관계를 수정합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.Admin])
  async updateFriendRelation(@Body() body: RequestUpdateFriendRelationDto) {
    return await this.friendsService.updateRelation_Admin(
      body.friend_id,
      body.relation_type,
    );
  }

  @Delete('/friends')
  @ApiOperation({
    summary: '특정 친구 관계를 삭제합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.Admin])
  async deleteFriendRelation(@Body() body: RequestUpdateFriendRelationDto) {
    return await this.friendsService.deleteFriend_Admin(body.friend_id);
  }

  /* Posting 제어 */

  @Get('/post/all')
  @ApiOperation({
    summary: '모든 우연 목록을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetAllPostDto,
    isArray: true,
  })
  @Roles([Role.Admin])
  async getAllPostList() {
    return await this.postingService.getAllPost_Admin();
  }

  @Patch('/post')
  @ApiOperation({
    summary: '특정 우연을 수정합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.Admin])
  async updatePost(@Body() body: RequestUpdatePostDto) {
    return await this.postingService.updatePost_Admin(body);
  }

  @Delete('/post')
  @ApiOperation({
    summary: '특정 우연을 삭제합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '특정 우연을 삭제합니다.',
  })
  @Roles([Role.Admin])
  async deletePost(@Body() body: RequestDeletePostDto) {
    return await this.postingService.deletePost_Admin(body.post_id);
  }
}
