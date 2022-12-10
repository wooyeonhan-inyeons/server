import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeleteUserDto {
  @ApiProperty()
  @IsString()
  user_id: string;
}
