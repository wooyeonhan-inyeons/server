import { Module } from '@nestjs/common';
import { FootprintController } from './footprint.controller';
import { FootprintService } from './footprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Footprint} from './footprint.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Footprint])],
  controllers: [FootprintController],
  providers: [FootprintService]
})
export class footprintModule {}


