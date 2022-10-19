import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>우아한 인연들 Devops 구축 완료</h1>';
  }
}
