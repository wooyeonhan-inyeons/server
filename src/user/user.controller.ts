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
  createUser(@Body() createUserData: RequestCreateUserDto) {
    return this.userService.create(createUserData);
  }

  // 조회
  @Get()
  @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto })
  @Roles([Role.Admin])
  getUserAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/user')
  @ApiCreatedResponse({ status: 200, type: ResponseReadUserDto, isArray: true })
  @Roles([Role.Admin])
  getUser(@Query('user_id') userID: string) {
    return this.userService.find(userID);
  }

  // 수정
  @Patch()
  @Roles([Role.Admin])
  patchUser(
    @Query('user_id') userID: string,
    @Body() updateData: RequestUpdateUserDto,
  ) {
    return this.userService.update(userID, updateData);
  }

  // 삭제
  @Delete()
  @Roles([Role.Admin])
  removeUser(@Query('user_id') userID: string) {
    return this.userService.delete(userID);
  }
}
