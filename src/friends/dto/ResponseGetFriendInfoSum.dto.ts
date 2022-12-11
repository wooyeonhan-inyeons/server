import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseGetFriendInfoSumDto {
  @ApiProperty()
  friend_count: number;

  @ApiProperty()
  request_count: number;
}
