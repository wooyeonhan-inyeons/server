import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  @ApiOperation({
    summary: 'healthcheck url 입니다.',
  })
  healthCheck(): string {
    return this.appService.getHealthCheck();
  }

  @Get()
  main(): string {
    return 'wooyeons';
  }
}
