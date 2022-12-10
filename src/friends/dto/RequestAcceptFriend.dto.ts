import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestAcceptFriendDto {
  @ApiProperty()
  @IsString()
  friend_id: string;
}
