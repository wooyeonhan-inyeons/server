import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyReportedException extends HttpException {
  constructor() {
    super({ message: '이미 신고했습니다.' }, HttpStatus.BAD_REQUEST);
  }
}
