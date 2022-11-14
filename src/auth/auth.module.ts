import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminModule } from 'src/admin/admin.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    PassportModule,
    AdminModule,
  ],
  providers: [
    JwtStrategy,
    LocalStrategy,
    AuthService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
