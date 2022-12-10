import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class FriendIdDto {
  @ApiProperty()
  @IsString()
  friend_id: string;
}

export class ResponseCreateFriendDto {
  @ApiProperty({
    type: FriendIdDto,
  })
  identifiers: FriendIdDto;

  @ApiProperty({
    type: FriendIdDto,
  })
  generatedMaps: FriendIdDto;

  @ApiProperty({
    type: FriendIdDto,
  })
  raw: FriendIdDto;
}
