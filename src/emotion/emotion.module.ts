import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emotion } from './emotion.entity';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';
import { Posting } from 'src/posting/posting.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion]), TypeOrmModule.forFeature([Posting]), TypeOrmModule.forFeature([User])],
  controllers: [EmotionController],
  providers: [EmotionService],
  exports: [EmotionService]
})
export class EmotionModule {}
