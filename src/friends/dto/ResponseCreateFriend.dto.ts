import { ApiProperty } from '@nestjs/swagger';

class FriendIdDto {
    @ApiProperty()
    friend_id: string
}

export class ResponseCreateFriendDto {

  @ApiProperty({
    type: FriendIdDto
  })
  identifiers: FriendIdDto

  @ApiProperty({
    type: FriendIdDto
  })
  generatedMaps: FriendIdDto

  @ApiProperty({
    type: FriendIdDto
  })
  raw: FriendIdDto

}
