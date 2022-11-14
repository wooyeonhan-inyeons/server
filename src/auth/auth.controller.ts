import { Controller, UseGuards, Request, Post } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseAdminLoginDto } from './dto/ResponseAdminLogin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/adminLogin')
  @ApiCreatedResponse({ status: 200, type: ResponseAdminLoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.adminLogin(req.user);
  }
}
