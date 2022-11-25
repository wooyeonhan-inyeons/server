import { ApiProperty } from '@nestjs/swagger';

class UserInfoDto {
    @ApiProperty()
    user_id: string

    @ApiProperty()
    name: string
}

export class ResponseGetRequestFriendListDto {

    @ApiProperty()
    friend_id: string

    @ApiProperty({
        type: UserInfoDto
    })
    following: UserInfoDto
}
