import { ApiProperty } from '@nestjs/swagger';

export class RequestCreatePostingDto {
  @ApiProperty()
  content: string;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  forFriend: number;
}
