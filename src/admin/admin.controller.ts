import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/all')
  @Roles([Role.User])
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  async login(@Request() req) {
    return this.adminService.findAll();
  }
}
