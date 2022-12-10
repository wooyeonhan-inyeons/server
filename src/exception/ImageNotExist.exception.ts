import { HttpException, HttpStatus } from '@nestjs/common';

export class ImageNotExistException extends HttpException {
  constructor() {
    super(
      { message: '이미지를 한개 이상 첨부해야합니다.' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
