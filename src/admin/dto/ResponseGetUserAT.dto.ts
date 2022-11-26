import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetUserATDto {
  @ApiProperty()
  access_token: string;
}
