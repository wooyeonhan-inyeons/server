import { Module } from '@nestjs/common';
import { PostingController } from './posting.controller';
import { PostingService } from './posting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from './posting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posting])],
  controllers: [PostingController],
  providers: [PostingService]
})
export class PostingModule {}
