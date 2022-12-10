import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class UserInfoDto {
  @ApiProperty()
  @IsString()
  user_id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class ResponseGetRequestFriendListDto {
  @ApiProperty()
  @IsString()
  friend_id: string;

  @ApiProperty({
    type: UserInfoDto,
  })
  following: UserInfoDto;
}
