import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emotion } from './emotion.entity';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion])],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}
