import {
  Controller,
  Request,
  Get,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  healthCheck(): string {
    return this.appService.getHealthCheck();
  }

  @Get()
  getHello(): string {
    Logger.log(`${process.env.DB_URL}`);
    return this.appService.getHello();
  }
}
