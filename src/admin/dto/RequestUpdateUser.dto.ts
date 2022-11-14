import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdateUserDto {
  @ApiProperty()
  @IsString()
  name: string;
}
