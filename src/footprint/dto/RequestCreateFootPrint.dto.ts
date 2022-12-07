import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateFootPrintDto {
  @ApiProperty()
  post_id: string;
}
