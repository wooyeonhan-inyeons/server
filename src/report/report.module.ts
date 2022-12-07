import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { UserModule } from 'src/user/user.module';
import { PostingModule } from 'src/posting/posting.module';
import { User } from 'src/user/user.entity';
import { Posting } from 'src/posting/posting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Posting]),
    UserModule,
    PostingModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
