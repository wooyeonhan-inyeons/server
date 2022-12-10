import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor() {
    super({ message: '유저가 존재하지 않습니다.' }, HttpStatus.NOT_FOUND);
  }
}
