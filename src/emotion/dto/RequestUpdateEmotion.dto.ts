import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdateEmotionDto {

  @ApiProperty()
  emotion_id: string;

  @ApiProperty()
  emotion_type: number;

}