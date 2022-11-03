import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("healthcheck")
  healthCheck(): string {
    Logger.log("/healthcheck 헬스체크 로그입니다.");
    return this.appService.getHealthCheck();
  }

  @Get()
  getHello(): string {
    Logger.log(`${process.env.DB_URL}`);
    return this.appService.getHello();
  }
}
