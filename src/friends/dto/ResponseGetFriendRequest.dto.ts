import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

class UserInfoDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class ResponseGetFriendRequestDto {
  @ApiProperty()
  @IsString()
  friend_id: string;

  @ApiProperty({
    type: UserInfoDto,
  })
  follower: UserInfoDto;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  created_at: Date;
}
