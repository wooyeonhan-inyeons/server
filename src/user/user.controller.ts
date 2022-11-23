import { Controller, Post, Body, Get, Query, Patch, Delete} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseReadUserDto } from 'src/admin/dto/ResponseReadUser.dto';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestCreateUserDto } from './dto/RequestCreateUser.dto';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {

    constructor(private userService: UserService){

    }

// 생성
  @Post()
  @Roles([Role.Admin])
  async createUser(@Body() createUserData: RequestCreateUserDto) {
    return await this.userService.create(createUserData);
  }

  // 조회
  @Get('/all')
  @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto, isArray: true, description: "모든 유저를 조회합니다."})
  @Roles([Role.Admin])
  async getUserAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get()
  @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto, description: "user_id의 유저를 조회합니다." })
  @Roles([Role.Admin])
  async getUser(@Query('user_id') userID: string) {
    return await this.userService.find(userID);
  }

  // 수정
  @Patch()
  @Roles([Role.Admin])
  async patchUser(
    @Query('user_id') userID: string,
    @Body() updateData: RequestUpdateUserDto,
  ) {
    return await this.userService.update(userID, updateData);
  }

  // 삭제
  @Delete()
  @Roles([Role.Admin])
  async removeUser(@Query('user_id') userID: string) {
    return await this.userService.delete(userID);
  }
}
