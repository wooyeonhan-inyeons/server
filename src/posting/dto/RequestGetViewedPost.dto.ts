import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class RequestGetViewedPostDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  public page: number = 0;
}
