import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello 우아한 인연들!! 롤링업데이트 테스트';
  }
}
