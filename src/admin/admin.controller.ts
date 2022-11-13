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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { UserService } from 'src/user/user.service';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private userService: UserService,
  ) {}

  @Get('/all')
  @Roles([Role.Admin])
  async login(@Request() req) {
    return this.adminService.findAll();
  }

  // 생성
  @Post('/user')
  @Roles([Role.Admin])
  createUser(@Body() createUserData: CreateUserDto) {
    return this.userService.create(createUserData);
  }

  // 조회
  @Get('/user/all')
  @Roles([Role.Admin])
  getUserAll() {
    return this.userService.findAll();
  }

  @Get('/user')
  @Roles([Role.Admin])
  getUser(@Query('user_id') userID: string) {
    return this.userService.find(userID);
  }

  // 수정
  @Patch('/user')
  @Roles([Role.Admin])
  patchUser(
    @Query('user_id') userID: string,
    @Body() updateData: UpdateUserDto,
  ) {
    return this.userService.update(userID, updateData);
  }

  // 삭제
  @Delete('/user')
  @Roles([Role.Admin])
  removeUser(@Query('user_id') userID: string) {
    return this.userService.delete(userID);
  }
}
