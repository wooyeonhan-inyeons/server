import { ApiProperty } from '@nestjs/swagger';

export class RequestDeletePostingDto {
  @ApiProperty()
  post_id: string;
}
