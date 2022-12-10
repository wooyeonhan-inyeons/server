import { HttpException, HttpStatus } from '@nestjs/common';

export class PostNotFoundException extends HttpException {
  constructor() {
    super({ message: '우연이 존재하지 않습니다.' }, HttpStatus.NOT_FOUND);
  }
}
