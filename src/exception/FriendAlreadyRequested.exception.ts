import { HttpException, HttpStatus } from '@nestjs/common';

export class FriendAlreadyRequestedException extends HttpException {
  constructor() {
    super({ message: '이미 친구 요청을 보냈습니다.' }, HttpStatus.BAD_REQUEST);
  }
}
