import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeleteFriendDto {
  @ApiProperty()
  @IsString()
  friend_id: string;
}
