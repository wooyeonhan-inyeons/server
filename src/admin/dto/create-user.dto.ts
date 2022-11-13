import { IsDate, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;
}
