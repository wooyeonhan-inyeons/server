import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestAddEmotionDto } from './dto/RequestAddEmotion.dto';
import { RequestDeleteFriendDto } from 'src/friends/dto/RequestDeleteFriend.dto';
import { EmotionService } from './emotion.service';
import { RequestDeleteEmotionDto } from './dto/RequestDeleteEmotion.dto';
import { RequestUpdateEmotionDto } from './dto/RequestUpdateEmotion.dto';

@ApiTags('emotion')
@ApiBearerAuth()
@Controller('emotion')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)

export class EmotionController {

    constructor(private emotionService: EmotionService){}

    //add

    @Post()
    @ApiCreatedResponse({
        status: 200,
        description: '감정표현을 추가합니다.',
    })
    @Roles([Role.User])
    async create(@Req() req, @Body() body: RequestAddEmotionDto) {
        return await this.emotionService
        .addEmotion(req.user.user_id, body.post_id, body.emotion_type)
        .catch((err) => {
            throw new HttpException(
            {
                message: err.message,
            },
            HttpStatus.BAD_REQUEST,
            );
        });
    }

    //delete
    @Delete()
    @Roles([Role.User])
    async deleteEmotion(@Body() body: RequestDeleteEmotionDto) {
        return await this.emotionService
        .deleteEmotion(body.emotion_id)
        .catch((err) => {
            throw new HttpException(
            {
                message: err.message,
            },
            HttpStatus.BAD_REQUEST,
            );
        });
    }

    //update
    @Patch()
    @Roles([Role.User])
    async updateEmotion(@Body() body: RequestUpdateEmotionDto) {
        return await this.emotionService
        .updateEmotion(body.emotion_id, body.emotion_type)
        .catch((err) => {
            throw new HttpException(
            {
                message: err.message,
            },
            HttpStatus.BAD_REQUEST,
            );
        });
    }
    
}


