import { ApiProperty } from '@nestjs/swagger';

export class RequestGetPostByLocationDto {
  @ApiProperty()
  longitude: number;

  @ApiProperty()
  latitude: number;
}
