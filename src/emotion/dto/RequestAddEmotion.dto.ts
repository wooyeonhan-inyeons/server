import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RequestAddEmotionDto {
  @ApiProperty()
  @IsString()
  post_id: string;

  @ApiProperty({
    description: '(0: 좋아요, 1: 멋져요, 2: 슬퍼요)',
  })
  @Type(() => Number)
  @IsNumber()
  emotion_type: number;
}
