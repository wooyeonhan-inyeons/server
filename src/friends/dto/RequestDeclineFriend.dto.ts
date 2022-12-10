import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeclineFriendDto {
  @ApiProperty()
  @IsString()
  friend_id: string;
}
