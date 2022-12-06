import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { ReportService } from './report.service';
import { RequestCreateReportDto } from './dto/RequestCreateReport.dto';
import { RequestDeleteReportDto } from './dto/RequestDeleteReport.dto';

@ApiTags('report')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
    constructor(private reportService: ReportService) { }

    // 신고
    @Post()
    @Roles([Role.User])
    async Report(@Req() req, @Body() body: RequestCreateReportDto) {
        return await this.reportService.addReport(
            body.report_type,
            req.user.user_id,
            body.post_id,
        );
    }

    // 신고 취소
    @Delete()
    @Roles([Role.User])
    async CancelReport(@Body() body: RequestDeleteReportDto, @Req() req) {
        const user_id = req.user.user_id;
        const post_id = req.post.post_id;
        return await this.reportService
            .deleteReport(user_id, post_id, body.report_id)
            .catch((err) => {
                throw new HttpException(
                    {
                        message: err.message,
                    },
                    HttpStatus.BAD_REQUEST,
                );
            });
    }
}
