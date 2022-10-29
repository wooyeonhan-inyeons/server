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
    Logger.log("/ 메인 로그입니다.");
    return this.appService.getHello();
  }
}
