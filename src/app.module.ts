import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Post,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { Admin } from './admin/admin.entity';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { PostingModule } from './posting/posting.module';
import { Posting } from './posting/posting.entity';
import { FriendsModule } from './friends/friends.module';
import { Friends } from './friends/friends.entity';
import { FootprintModule } from './footprint/footprint.module';
import { Footprint } from './footprint/footprint.entity';
import { UserBookmarksModule } from './user_bookmarks/user_bookmarks.module';
import { ImageModule } from './image/image.module';
import { VideoModule } from './video/video.module';
import { FlagModule } from './flag/flag.module';
import { User_bookmarks } from './user_bookmarks/user_bookmarks.entity';
import { Image } from './image/image.entity';
import { Video } from './video/video.entity';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: process.env.NODE_ENV === 'prod' ? '.prod.env' : '.dev.env',
  }), TypeOrmModule.forRoot({
    type: 'mariadb',
    host: `${process.env.DB_URL}`,
    port: Number(process.env.DB_PORT),
    username: `${process.env.DB_USER}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    entities: [Admin, User, Posting, Friends, Footprint, User_bookmarks, Image, Video,
    ],
    synchronize: true,
  }), AdminModule, UserModule, PostingModule, FriendsModule, FootprintModule, AuthModule, UserBookmarksModule, ImageModule, VideoModule, FlagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: '/healthcheck', method: RequestMethod.GET })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
