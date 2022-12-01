import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { FootprintService } from './footprint.service';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('footprint')
export class FootprintController {
    constructor(
        private footprintService: FootprintService
    ) { }

    // 발자국 수 추가
    @Post()
    @ApiCreatedResponse({
        status: 200,
        type: CreateFootprintDto,
        description: '발자국 수를 늘립니다.',
    })
    async updateFootPrint(@Req() req) {
        return await this.footprintService.addFootprint(
            req.user.user_id,
            req.post.post_id,
        );
    }

    // 발자국 수 조회
    @Get()
    async getFootprints(@Req() req) {
        return await this.footprintService.getFootprints(req.post.post_id);
    }
}
