import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { Admin } from './admin/admin.entity';

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
    entities: [Admin],
    synchronize: true,
  }), AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}