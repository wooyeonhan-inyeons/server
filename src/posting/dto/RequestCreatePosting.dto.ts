import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsString,
  Validate,
} from 'class-validator';

export class RequestCreatePostingDto {
  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  forFriend: number;

  @ApiProperty()
  file: Express.Multer.File[];
}
