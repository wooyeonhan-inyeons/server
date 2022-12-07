import { ApiProperty } from '@nestjs/swagger';

class UserInfoDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  name: string;
}

export class ResponseGetFriendRequestDto {
  @ApiProperty()
  friend_id: string;

  @ApiProperty({
    type: UserInfoDto,
  })
  follower: UserInfoDto;

  @ApiProperty()
  created_at: Date;
}
