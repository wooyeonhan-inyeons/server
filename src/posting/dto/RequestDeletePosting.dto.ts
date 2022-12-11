import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeletePostingDto {
  @ApiProperty()
  @IsString()
  post_id: string;
}
