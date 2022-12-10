import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RequestCreateReportDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  report_type: number;

  @ApiProperty()
  @IsString()
  post_id: string;
}
