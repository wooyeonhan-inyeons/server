import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor() {
    super({ message: '잘못된 요청입니다.' }, HttpStatus.BAD_REQUEST);
  }
}
