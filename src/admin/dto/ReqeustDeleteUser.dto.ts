import { ApiProperty } from '@nestjs/swagger';

export class RequestDeleteUserDto {
  @ApiProperty()
  user_id: string;
}
