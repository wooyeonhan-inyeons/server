import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetAllPostDto {
  @ApiProperty()
  post_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  forFriend: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  name: string;
}
