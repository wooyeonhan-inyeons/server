import { Module } from '@nestjs/common';
import { FootprintController } from './footprint.controller';
import { FootprintService } from './footprint.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Footprint } from './footprint.entity';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Footprint]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Posting]),
  ],
  controllers: [FootprintController],
  providers: [FootprintService],
  exports: [FootprintService],
})
export class FootprintModule {}
