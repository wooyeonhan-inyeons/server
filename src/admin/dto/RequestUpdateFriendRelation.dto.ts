import { ApiProperty } from '@nestjs/swagger';

export class RequestUpdateFriendRelationDto {
  @ApiProperty()
  friend_id: string;

  @ApiProperty()
  relation_type: number;
}
