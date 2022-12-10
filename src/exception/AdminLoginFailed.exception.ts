import { HttpException, HttpStatus } from '@nestjs/common';

export class AdminLoginFailedException extends HttpException {
  constructor() {
    super(
      { message: '로그인 정보가 알맞지 않습니다.' },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
