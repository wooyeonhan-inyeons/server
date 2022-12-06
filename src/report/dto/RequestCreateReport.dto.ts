import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class RequestCreateReportDto {
    @ApiProperty()
    @IsNumber()
    report_type: number;

    @ApiProperty()
    @IsString()
    post_id: string;
}