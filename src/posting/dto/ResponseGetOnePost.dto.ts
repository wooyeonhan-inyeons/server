import { ApiProperty } from '@nestjs/swagger';

class Image {
  @ApiProperty()
  img_id: string;

  @ApiProperty()
  img_url: string;
}

class Emotion {
  @ApiProperty()
  emotion_id: string;

  @ApiProperty()
  emotion_type: number;
}

export class ResponseGetOnePostDto {
  @ApiProperty()
  post_id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  created_time: Date;

  @ApiProperty()
  footprint_count: number;

  @ApiProperty()
  forFriend: number;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  like_count: number;

  @ApiProperty()
  cool_count: number;

  @ApiProperty()
  sad_count: number;

  @ApiProperty({
    type: Emotion,
  })
  emotion: Emotion;

  @ApiProperty({
    type: Image,
    isArray: true,
  })
  img: Image;

  @ApiProperty()
  distance: number;

  @ApiProperty()
  owner: boolean;
}
