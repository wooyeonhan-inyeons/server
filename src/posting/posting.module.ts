import { Module } from '@nestjs/common';
import { PostingController } from './posting.controller';
import { PostingService } from './posting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from './posting.entity';
import { MulterModule } from '@nestjs/platform-express';
import { S3Module } from 'src/s3/s3.module';
import { UserModule } from 'src/user/user.module';
import { FootprintModule } from 'src/footprint/footprint.module';
import { EmotionModule } from 'src/emotion/emotion.module';
import { Emotion } from 'src/emotion/emotion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posting, Emotion]),
    S3Module,
    UserModule,
    FootprintModule,
    EmotionModule,
  ],
  controllers: [PostingController],
  providers: [PostingService],
  exports: [PostingService],
})
export class PostingModule {}
