import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetViewedPostDto {
  @ApiProperty()
  post_id: string;

  @ApiProperty()
  created_time: Date;

  @ApiProperty()
  img_url: string;
}
