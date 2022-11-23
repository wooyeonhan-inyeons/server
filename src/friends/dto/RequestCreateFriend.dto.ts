import { ApiProperty } from '@nestjs/swagger';

export class RequestCreateFriendDto {

  @ApiProperty()
  following_id: string;

}
