import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetAllReportDto {
  @ApiProperty()
  report_id: string;
  @ApiProperty()
  post_id: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  reporter_name: string;
  @ApiProperty()
  author_name: string;
  @ApiProperty()
  report_type: number;
}
