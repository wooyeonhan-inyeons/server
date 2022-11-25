import { ApiProperty } from '@nestjs/swagger';

export class RequestDeclineFriendDto {

  @ApiProperty()
  friend_id: string;

}
