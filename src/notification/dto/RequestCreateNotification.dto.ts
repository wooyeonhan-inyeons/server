import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class RequestCreateNotificationDto {
    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty()
    @IsBoolean()
    viewed: boolean;

    @ApiProperty()
    @IsNumber()
    type: number;
}