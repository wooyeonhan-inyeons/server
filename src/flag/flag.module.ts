import { Module } from '@nestjs/common';
import { FlagController } from './flag.controller';
import { FlagService } from './flag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flag } from './flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Flag])],
  controllers: [FlagController],
  providers: [FlagService]
})
export class FlagModule {}
