import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class RequestCreateReportDto {
    @ApiProperty()
    @IsNumber()
    report_type: number;


}