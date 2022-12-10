import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class RequestGetPostByLocationDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  public latitude: number = 0;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  public longitude: number = 0;
}
