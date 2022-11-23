import {
  Controller,
  UseGuards,
  Req,
  Request,
  Post,
  Body,
  Query,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAdminLoginDto } from './dto/ResponseAdminLogin.dto';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { ResponseUserLoginDto } from './dto/ResponseUserLogin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
    ) {}

  @Post('/admin')
  @ApiCreatedResponse({ status: 200, type: ResponseAdminLoginDto , description: "어드민 로그인"})
  @UseGuards(LocalAuthGuard)
  async login(
    @Request() req,
    @Query('username') username: string,
    @Query('password') password: string,
  ) {
    return this.authService.adminLogin(req.user);
  }

  @Get('/kakao')
  @ApiCreatedResponse({ status: 200, type:  ResponseUserLoginDto, description: "유저 카카오 소셜로그인"})
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(){
    return HttpStatus.OK
  }

  @Get('/kakao/oauth')
  @UseGuards(KakaoAuthGuard)
  async kakaoRedirect(@Req() req){
    if(req.user.email == null){
      return HttpStatus.NOT_ACCEPTABLE
    } 
    return await this.authService.userLogin(req.user)
  }
}
