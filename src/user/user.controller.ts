import { Controller, Post, Body, Get, Query, Patch, Delete, UseGuards} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ResponseReadUserDto } from 'src/admin/dto/ResponseReadUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestCreateUserDto } from './dto/RequestCreateUser.dto';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class UserController {

    constructor(private userService: UserService){

      

    }


}