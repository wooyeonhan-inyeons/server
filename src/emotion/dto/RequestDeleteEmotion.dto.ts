import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeleteEmotionDto {
  @ApiProperty()
  @IsString()
  emotion_id: string;
}
