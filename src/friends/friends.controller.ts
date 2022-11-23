import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestCreateFriendDto } from './dto/RequestCreateFriend.dto';
import { FriendsService } from './friends.service';

@Controller('friends')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class FriendsController {

    constructor(
        private friendsService: FriendsService
    ){
        
    }

    @Post()
    @Roles([Role.User])
    async create(@Req() req, @Body() body: RequestCreateFriendDto){
        return await this.friendsService.createRelation(req.user.user_id, body.following_id)
    }

    @Get()
    @Roles([Role.User])
    async getAllFriend(@Req() req){
        return await this.friendsService.getFriendsList(req.user.user_id)
    }
}
