import { ApiProperty } from '@nestjs/swagger';

export class RequestAddEmotionDto {
  @ApiProperty()
  post_id: string;

  @ApiProperty({
    description: '(0: 좋아요, 1: 멋져요, 2: 슬퍼요)',
  })
  emotion_type: number;
}
