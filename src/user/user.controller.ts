import {
  Controller,
  Body,
  Get,
  Query,
  Patch,
  Delete,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestGetUserDto } from './dto/RequestGetUser.dto';
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
  @ApiOperation({
    summary: '본인 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserDto,
  })
  @Roles([Role.User])
  async getOwnUser(@Req() req) {
    return await this.userService.findOne(req.user.user_id);
  }

  // 수정
  @Patch()
  @ApiOperation({
    summary: '본인 정보를 수정합니다.',
  })
  @Roles([Role.User])
  async patchUser(@Req() req, @Body() updateData: RequestUpdateUserDto) {
    return await this.userService.update(req.user.user_id, updateData);
  }

  // 삭제
  @Delete()
  @ApiOperation({
    summary: '본인 정보를 삭제합니다.',
  })
  @Roles([Role.User])
  async removeUser(@Req() req) {
    return await this.userService.delete(req.user.user_id);
  }

  @Get('search')
  @ApiOperation({
    summary: '상대 정보를 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserDto,
  })
  @Roles([Role.User])
  async getUser(@Query() query: RequestGetUserDto) {
    const { user_id } = query;
    return await this.userService.findOne(user_id);
  }
}
