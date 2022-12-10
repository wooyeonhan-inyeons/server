import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RequestUpdateEmotionDto {
  @ApiProperty()
  @IsString()
  emotion_id: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  emotion_type: number;
}
