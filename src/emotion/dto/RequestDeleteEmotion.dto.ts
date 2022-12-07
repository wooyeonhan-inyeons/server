import { ApiProperty } from '@nestjs/swagger';

export class RequestDeleteEmotionDto {

  @ApiProperty()
  emotion_id: string;

}