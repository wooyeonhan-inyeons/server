import { HttpException, HttpStatus } from '@nestjs/common';

export class AlreadyFriendException extends HttpException {
  constructor() {
    super({ message: '이미 친구입니다.' }, HttpStatus.BAD_REQUEST);
  }
}
