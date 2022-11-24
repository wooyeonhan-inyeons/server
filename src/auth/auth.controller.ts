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
  Res,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAdminLoginDto } from './dto/ResponseAdminLogin.dto';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { ResponseUserLoginDto } from './dto/ResponseUserLogin.dto';
import { Response } from 'express';

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
  async kakaoRedirect(@Req() req, @Res() res: Response){
    if(req.user.email == null){
      return HttpStatus.NOT_ACCEPTABLE
    } 
    const result =  await this.authService.userLogin(req.user)
    res.redirect(`${process.env.CLIENT_URL}/auth/kakao/redirect?access_token=${result.access_token}`)
  }
}
