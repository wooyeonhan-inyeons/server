import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestCreateFriendDto {
  @ApiProperty()
  @IsString()
  following_id: string;
}
