import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestGetUserATDto {
  @ApiProperty()
  @IsString()
  user_id: string;
}
