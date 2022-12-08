import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class RequestCreateNotificationDto {
    @ApiProperty()
    @IsString()
    notification_id: string;

    @ApiProperty()
    @IsString()
    user_id: string;

    @ApiProperty()
    @IsString()
    message: string;

    @ApiProperty()
    @IsBoolean()
    viewed: boolean;

    @ApiProperty()
    @IsBoolean()
    type: number;
}