import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emotion } from './emotion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Emotion])],
})
export class EmotionModule {}
