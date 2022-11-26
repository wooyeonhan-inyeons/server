import { ApiProperty } from '@nestjs/swagger';

export class ResponseReadUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  created_at: Date;
}
