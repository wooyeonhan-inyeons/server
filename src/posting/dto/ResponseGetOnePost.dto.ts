import { ApiProperty } from '@nestjs/swagger';

class Image {
  @ApiProperty()
  img_id: string;

  @ApiProperty()
  img_url: string;
}

export class ResponseGetOnePostDto {
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
  @ApiProperty({
    type: Image,
    isArray: true,
  })
  img: Image;

  @ApiProperty()
  distance: number;
}
