import { HttpException, HttpStatus } from '@nestjs/common';

export class PostAccessFailedException extends HttpException {
  constructor() {
    super(
      { message: '50m 이내 게시물만 조회할 수 있거나, 친구가 아닙니다.' },
      HttpStatus.NOT_ACCEPTABLE,
    );
  }
}
