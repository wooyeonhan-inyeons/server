import { ApiProperty } from '@nestjs/swagger';

class UserInfoDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;
}

class FollowerArrayDto {
  @ApiProperty()
  friend_id: string;

  @ApiProperty({
    type: UserInfoDto,
  })
  follower: UserInfoDto;
}

class FollowingArrayDto {
  @ApiProperty()
  friend_id: string;

  @ApiProperty({
    type: UserInfoDto,
  })
  follower: UserInfoDto;
}

export class ResponseGetAllFriendDto {
  @ApiProperty({
    type: FollowerArrayDto,
  })
  follower: FollowerArrayDto;

  @ApiProperty({
    type: FollowingArrayDto,
  })
  following: FollowingArrayDto;
}
