import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserLoginDto {
  @ApiProperty()
  access_token: string;
}
