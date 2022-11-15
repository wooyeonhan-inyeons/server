import { Module } from '@nestjs/common';
import { UserBookmarksController } from './user_bookmarks.controller';
import { UserBookmarksService } from './user_bookmarks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User_bookmarks} from './user_bookmarks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User_bookmarks])],
  controllers: [UserBookmarksController],
  providers: [UserBookmarksService]
})
export class UserBookmarksModule {}

