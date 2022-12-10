import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeleteReportDto {
  @ApiProperty()
  @IsString()
  report_id: string;
}
