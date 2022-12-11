import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetUserInfoDto {
  @ApiProperty()
  posting_count: number;

  @ApiProperty()
  emotion_count: number;

  @ApiProperty()
  friend_count: number;
}
