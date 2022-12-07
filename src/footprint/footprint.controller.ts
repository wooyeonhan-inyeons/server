import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FootprintService } from './footprint.service';
import { RequestCreateFootPrintDto } from './dto/RequestCreateFootPrint.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';

@ApiTags('footprint')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('footprint')
export class FootprintController {
  constructor(private footprintService: FootprintService) {}

  // 발자국 수 추가
  @Post()
  @Roles([Role.User])
  async createFootPrint(@Req() req, @Body() body: RequestCreateFootPrintDto) {
    return await this.footprintService.addFootprint(
      req.user.user_id,
      body.post_id,
    );
  }

  // 발자국 수 조회
  @Get()
  @Roles([Role.User])
  async getFootprints(@Query('post_id') post_id: string) {
    return await this.footprintService.getFootprints(post_id);
  }
}
