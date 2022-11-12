import { Controller, Get, UseGuards, Request, Post } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/adminLogin')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.adminLogin(req.user);
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }
}
