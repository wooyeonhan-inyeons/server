import { ApiProperty } from '@nestjs/swagger';

export class RequestDeleteReportDto {
  @ApiProperty()
  report_id: string;
}
