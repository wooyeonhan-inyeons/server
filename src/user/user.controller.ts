import {
  Controller,
  Body,
  Get,
  Query,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { ResponseGetUserDto } from './dto/ResponseGetUser.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserDto,
    description: '본인 정보를 조회합니다.',
  })
  @Roles([Role.User])
  async getOwnUser(@Req() req) {
    return await this.userService.findOne(req.user.user_id);
  }

  // 수정
  @Patch()
  @Roles([Role.User])
  async patchUser(@Req() req, @Body() updateData: RequestUpdateUserDto) {
    return await this.userService.update(req.user_id, updateData);
  }

  // 삭제
  @Delete()
  @Roles([Role.User])
  async removeUser(@Req() req) {
    return await this.userService.delete(req.user_id);
  }

  @Get('search')
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserDto,
    description: '상대 정보를 조회합니다.',
  })
  @Roles([Role.User])
  async getUser(@Query('user_id') user_id: string) {
    return await this.userService.findOne(user_id);
  }
}
