import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseGetUserDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  follower_count: number;

  @ApiProperty()
  following_count: number;
}
