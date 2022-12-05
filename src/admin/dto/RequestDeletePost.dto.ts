import { ApiProperty } from '@nestjs/swagger';

export class RequestDeletePostDto {
  @ApiProperty()
  post_id: string;
}
