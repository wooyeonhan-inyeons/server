import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { ReportService } from './report.service';
import { RequestCreateReportDto } from './dto/RequestCreateReport.dto';

@ApiTags('report')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('report')
export class ReportController {
  constructor(private reportService: ReportService) {}

  // 신고
  @Post()
  @ApiOperation({
    summary: '특정 우연을 신고합니다.',
  })
  @Roles([Role.User])
  async Report(@Req() req, @Body() body: RequestCreateReportDto) {
    return await this.reportService.addReport(
      body.report_type,
      req.user.user_id,
      body.post_id,
    );
  }
}
