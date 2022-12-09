import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetAllPostDto {
  @ApiProperty()
  post_id: string;

  @ApiProperty()
  created_time: Date;

  @ApiProperty()
  img_url: string;
}
