import { HttpException, HttpStatus } from '@nestjs/common';

export class EmotionDuplicatedException extends HttpException {
  constructor() {
    super({ message: '중복된 감정표현입니다.' }, HttpStatus.BAD_REQUEST);
  }
}
