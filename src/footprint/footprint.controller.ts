import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { FootprintService } from './footprint.service';

@Controller('footprint')
export class FootprintController {
    constructor(
        private footprintService: FootprintService
    ) { }

    // 발자국 수 추가
    @Post()
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
