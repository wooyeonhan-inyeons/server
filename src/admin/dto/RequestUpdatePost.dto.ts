import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RequestUpdatePostDto {
  @ApiProperty()
  @IsString()
  post_id: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  forFriend: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;
}
