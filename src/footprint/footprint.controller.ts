import { Controller, Get, Post, Query } from '@nestjs/common';
import { FootprintService } from './footprint.service';

@Controller('footprint')
export class FootprintController {
    constructor(
        private footprintService: FootprintService
    ) { }

    // 발자국 수 추가
    @Post()
    async updateFootPrint(@Query() query) {
        return await this.footprintService.addFootprint(
            query.user_id,
            query.post_id,
        );
    }

    // 발자국 수 조회
    @Get()
    async getFootprints(@Query() query) {
        return await this.footprintService.getFootprints(query.post_id);
    }
}
