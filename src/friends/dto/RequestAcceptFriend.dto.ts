import { ApiProperty } from '@nestjs/swagger';

export class RequestAcceptFriendDto {

  @ApiProperty()
  friend_id: string;

}
