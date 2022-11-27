import { ApiProperty } from '@nestjs/swagger';

class UserInfoDto {
  @ApiProperty()
  name: string;
}

export class ResponseGetAllFriendByAdminDto {
  @ApiProperty({
    type: UserInfoDto,
  })
  follower: UserInfoDto;

  @ApiProperty({
    type: UserInfoDto,
  })
  following: UserInfoDto;

  @ApiProperty()
  relation_type: number;
}
