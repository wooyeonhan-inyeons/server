import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class UserInfoDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  message: string;
}

class FollowerArrayDto {
  @ApiProperty()
  @IsString()
  friend_id: string;

  @ApiProperty({
    type: UserInfoDto,
  })
  follower: UserInfoDto;
}

class FollowingArrayDto {
  @ApiProperty()
  @IsString()
  friend_id: string;

  @ApiProperty({
    type: UserInfoDto,
  })
  follower: UserInfoDto;
}

export class ResponseGetAllFriendDto {
  @ApiProperty({
    type: FollowerArrayDto,
    isArray: true,
  })
  follower: FollowerArrayDto;

  @ApiProperty({
    type: FollowingArrayDto,
    isArray: true,
  })
  following: FollowingArrayDto;
}
