import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FootprintService } from './footprint.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('footprint')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('footprint')
export class FootprintController {
  constructor(private footprintService: FootprintService) {}

  // 발자국 수 추가
  // @Post()
  // @ApiOperation({
  //   summary: '발자국을 생성합니다.',
  // })
  // @Roles([Role.User])
  // async createFootPrint(@Req() req, @Body() body: RequestCreateFootPrintDto) {
  //   return await this.footprintService
  //     .addFootprint(req.user.user_id, body.post_id)
  //     .catch((err) => {
  //       throw new InternalServerErrorException({
  //         statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //         message: err.message,
  //       });
  //     });
  // }

  // 발자국 수 조회
  // @Get()
  // @ApiOperation({
  //   summary: '발자국 수를 조회합니다.',
  // })
  // @Roles([Role.User])
  // async getFootprints(@Query('post_id') post_id: string) {
  //   return await this.footprintService.getFootprints(post_id).catch((err) => {
  //     throw new InternalServerErrorException({
  //       statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  //       message: err.message,
  //     });
  //   });
  // }
}
