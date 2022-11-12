import { Body, Controller, Delete, Get, Patch, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateUserDto } from './update-user.dto';

@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService
    ) { }

    // 조회
    @Get()
    search() {
        return this.adminService.findAll();
    }

    @Get()
    getOne(@Query('user_id') userID: string) {
        return this.adminService.findOne(userID);
    }

    // 수정
    @Patch()
    patch(@Query('user_id') userID: string, @Body() updateData: UpdateUserDto) {
        return this.adminService.update(userID, updateData);
    }

    // 삭제
    @Delete()
    remove(@Query('user_id') userID: string) {
        return this.adminService.deleteOne(userID);
    }
}
