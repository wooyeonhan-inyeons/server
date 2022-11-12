import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { UserModule } from 'src/user/user.module';


@Module({
    imports: [TypeOrmModule.forFeature([Admin]), UserModule],
    providers: [AdminService],
    controllers: [AdminController]
})
export class AdminModule { }
