import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestDeletePostDto {
  @ApiProperty()
  @IsString()
  post_id: string;
}
