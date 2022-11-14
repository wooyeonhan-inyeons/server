import { ApiProperty } from '@nestjs/swagger';

export class ResponseAdminLoginDto {
  @ApiProperty()
  access_token: string;
}
