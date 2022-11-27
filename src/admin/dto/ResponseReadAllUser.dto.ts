import { ApiProperty } from '@nestjs/swagger';

export class ResponseReadAllUserDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  follower_count: number;

  @ApiProperty()
  following_count: number;

  @ApiProperty()
  created_at: Date;
}
