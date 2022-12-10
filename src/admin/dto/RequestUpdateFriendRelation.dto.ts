import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RequestUpdateFriendRelationDto {
  @ApiProperty()
  @IsString()
  friend_id: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  relation_type: number;
}
