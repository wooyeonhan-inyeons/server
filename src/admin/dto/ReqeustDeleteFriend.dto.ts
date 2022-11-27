import { ApiProperty } from '@nestjs/swagger';

export class RequestDeleteFriendDto {
  @ApiProperty()
  friend_id: string;
}
