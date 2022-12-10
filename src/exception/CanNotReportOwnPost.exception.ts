import { HttpException, HttpStatus } from '@nestjs/common';

export class CannotReportOwnPostException extends HttpException {
  constructor() {
    super(
      { message: '본인의 우연은 신고할 수 없습니다.' },
      HttpStatus.BAD_REQUEST,
    );
  }
}
