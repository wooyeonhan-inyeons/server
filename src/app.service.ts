import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1>우아한 인연들 Devops 구축 완료</h1>';
  }

  getHealthCheck(): string {
    return '<h1>우아한 인연들 서버는 건강합니다.</h1>';
  }
}
