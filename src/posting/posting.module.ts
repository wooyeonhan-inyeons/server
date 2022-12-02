import { Module } from '@nestjs/common';
import { PostingController } from './posting.controller';
import { PostingService } from './posting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from './posting.entity';
import { MulterModule } from '@nestjs/platform-express';
import { S3Module } from 'src/s3/s3.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posting]), S3Module, UserModule],
  controllers: [PostingController],
  providers: [PostingService],
})
export class PostingModule {}
