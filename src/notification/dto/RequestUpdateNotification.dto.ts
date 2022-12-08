import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class RequestUpdateNotificationDto {
    @ApiProperty()
    @IsString()
    notification_id: string;

    @ApiProperty()
    @IsBoolean()
    viewed: boolean;
}