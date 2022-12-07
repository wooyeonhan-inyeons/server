import { ApiProperty } from '@nestjs/swagger';

export class RequestAddEmotionDto {

  @ApiProperty()
  post_id: string;

  @ApiProperty()
  emotion_type: number;

}
