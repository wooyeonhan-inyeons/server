import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestGetAccessablePostDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  public latitude: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  public longitude: number;
}
