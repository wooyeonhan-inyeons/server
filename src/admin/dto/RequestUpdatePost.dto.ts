import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdatePostDto {
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
}
