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
  InternalServerErrorException,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseAdminLoginDto } from './dto/ResponseAdminLogin.dto';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { ResponseUserLoginDto } from './dto/ResponseUserLogin.dto';
import { Response } from 'express';
import { RequestAdminLoginDto } from './dto/RequestAdminLogin.dto';
import { NeedKakaoEmailException } from 'src/exception/NeedKakaoEmail.exception';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '어드민 로그인',
  })
  @Post('/admin')
  @ApiCreatedResponse({ status: 200, type: ResponseAdminLoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req, @Body() body: RequestAdminLoginDto) {
    return this.authService.adminLogin(req.user);
  }

  @Get('/kakao')
  @ApiOperation({
    summary: '유저 카카오 소셜 로그인.',
  })
  @ApiCreatedResponse({ status: 200, type: ResponseUserLoginDto })
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('/kakao/oauth')
  @ApiOperation({
    summary: '카카오 Redirect URL.',
  })
  @UseGuards(KakaoAuthGuard)
  async kakaoRedirect(@Req() req, @Res() res: Response) {
    // if (req.user.email == null) {
    //   throw new NeedKakaoEmailException();
    // }
    const result = await this.authService.userLogin(req.user);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/kakao/redirect?access_token=${result.access_token}`,
    );
  }
}
