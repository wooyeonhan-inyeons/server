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
  InternalServerErrorException,
  HttpStatus,
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
import { ReportService } from 'src/report/report.service';
import { ResponseGetAllReportDto } from './dto/ResponseGetAllReport.dto';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { RequestGetUserDto } from './dto/RequestGetUser.dto';
import { RequestGetUserATDto } from './dto/RequestGetUserAT.dto';
import { query } from 'express';
import { RequestDeleteReportDto } from './dto/RequestDeleteReport.dto';

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
    private reportService: ReportService,
  ) {}

  @Get('/all')
  @ApiOperation({
    summary: '?????? ???????????? ???????????????.',
  })
  @Roles([Role.Admin])
  async login(@Request() req) {
    return await this.adminService.findAll();
  }

  /* User ?????? */

  // ??????
  @Post('/user')
  @ApiOperation({
    summary: '????????? ????????? ???????????????.',
  })
  @Roles([Role.Admin])
  async createUser(@Body() createUserData: RequestCreateUserDto) {
    return await this.userService.create(createUserData);
  }

  // ??????
  @Get('/user/all')
  @ApiOperation({
    summary: '?????? ????????? ???????????????.',
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
    summary: '?????? ????????? ???????????????.',
  })
  @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto })
  @Roles([Role.Admin])
  async getUser(@Query() query: RequestGetUserDto) {
    const { user_id } = query;
    return await this.userService.findOne(user_id);
  }

  @Get('/userAT')
  @ApiOperation({
    summary: '?????? ????????? access_token??? ?????? ??? ????????????.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserATDto,
  })
  @Roles([Role.Admin])
  async getUserAT(@Query() query: RequestGetUserATDto) {
    const { user_id } = query;
    return await this.adminService.getUserAccessToken(user_id);
  }

  // ??????
  @Patch('/user')
  @ApiOperation({
    summary: '?????? ?????? ????????? ???????????????.',
  })
  @Roles([Role.Admin])
  async patchUser(@Body() body: RequestUpdateUserDto) {
    return await this.userService.update(body.user_id, body);
  }

  // ??????
  @Delete('/user')
  @ApiOperation({
    summary: '?????? ????????? ???????????????.',
  })
  @Roles([Role.Admin])
  async removeUser(@Body() body: RequestDeleteUserDto) {
    return await this.userService.delete(body.user_id);
  }

  /* Friends ?????? */

  @Get('/friends/all')
  @ApiOperation({
    summary: '?????? ?????? ????????? ???????????????.',
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
    summary: '?????? ????????? ???????????????.',
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
    summary: '?????? ?????? ????????? ???????????????.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.Admin])
  async deleteFriendRelation(@Body() body: RequestUpdateFriendRelationDto) {
    return await this.friendsService.deleteFriend_Admin(body.friend_id);
  }

  /* Posting ?????? */

  @Get('/post/all')
  @ApiOperation({
    summary: '?????? ?????? ????????? ???????????????.',
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
    summary: '?????? ????????? ???????????????.',
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
    summary: '?????? ????????? ???????????????.',
  })
  @ApiCreatedResponse({
    status: 200,
    description: '?????? ????????? ???????????????.',
  })
  @Roles([Role.Admin])
  async deletePost(@Body() body: RequestDeletePostDto) {
    return await this.postingService.deletePost_Admin(body.post_id);
  }

  /* Report ?????? */

  @Get('/report/all')
  @ApiOperation({
    summary: '?????? ?????? ????????? ???????????????.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetAllReportDto,
    isArray: true,
  })
  @Roles([Role.Admin])
  async getAllReportList() {
    return await this.reportService.getAllReport_Admin();
  }

  @Delete('/report')
  @ApiOperation({
    summary: '?????? ????????? ???????????????.',
  })
  @ApiCreatedResponse({
    status: 200,
  })
  @Roles([Role.Admin])
  async deleteReport(@Body() body: RequestDeleteReportDto) {
    return await this.reportService.deleteReport_Admin(body.report_id);
  }
}
