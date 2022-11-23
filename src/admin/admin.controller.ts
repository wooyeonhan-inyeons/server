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

@ApiTags('admin')
@ApiBearerAuth()
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

  // // 생성
  // @Post('/user')
  // @Roles([Role.Admin])
  // createUser(@Body() createUserData: RequestCreateUserDto) {
  //   return this.userService.create(createUserData);
  // }

  // // 조회
  // @Get('/user/all')
  // @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto })
  // @Roles([Role.Admin])
  // getUserAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  // @Get('/user')
  // @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto, isArray: true })
  // @Roles([Role.Admin])
  // getUser(@Query('user_id') userID: string) {
  //   return this.userService.find(userID);
  // }

  // // 수정
  // @Patch('/user')
  // @Roles([Role.Admin])
  // patchUser(
  //   @Query('user_id') userID: string,
  //   @Body() updateData: RequestUpdateUserDto,
  // ) {
  //   return this.userService.update(userID, updateData);
  // }

  // // 삭제
  // @Delete('/user')
  // @Roles([Role.Admin])
  // removeUser(@Query('user_id') userID: string) {
  //   return this.userService.delete(userID);
  // }
}
