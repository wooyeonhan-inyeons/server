import { Controller,Post,Get, Query, UseGuards, Logger, Delete, Req,    } from '@nestjs/common';
import { Posting } from './posting.entity';
import { User } from 'src/user/user.entity';
import { PostingService } from './posting.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { AuthGuard } from '@nestjs/passport';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('posting')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class PostingController {

    constructor(private postingService: PostingService){

    }

    @Roles([Role.User])
    @Get('/:post_id') //post_id를 통해 posting에 있는 데이터를 끌어옴
    async getPostingById(@Query('post_id') post_id: string) {
        return await this.postingService.getPostingById(post_id);
    }

    
    // 유저의 토큰 사용필요
    @Roles([Role.User])
    @Get() //user_id를 통해 그 유저가 작성한 posting들을 끌어옴
    async getAllPostings(@Req() req){
        return this.getAllPostings(req.user.user_id);
    }
    
    
    @Roles([Role.User])
    @Delete() //post_id를 사용해 그 게시물 삭제함
    async deletePosting(@Req() req){
        this.postingService.deletePosting(req.User.post_id);
        return;
    }

}
