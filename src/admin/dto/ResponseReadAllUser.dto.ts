import { ApiProperty } from '@nestjs/swagger';

export class ResponseReadAllUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;
}
