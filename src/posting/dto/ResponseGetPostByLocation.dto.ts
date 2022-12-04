import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetPostByLocation {
  @ApiProperty()
  post_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_time: Date;

  @ApiProperty()
  forFriend: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
