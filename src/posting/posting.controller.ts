import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { PostingService } from './posting.service';

@Controller('posting')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class PostingController {
  constructor(private postingService: PostingService) {}

  // @Post()
  // @Roles([Role.User])
  // @UseInterceptors(FilesInterceptor('file'))
  // async uploadTest(@UploadedFiles() files: Express.Multer.File[]) {
  //   console.log(files);
  //   await this.postingService.uploadTest(files);
  // }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        forFriend: { type: 'integer' },
        longtitude: { type: 'double' },
        latitude: { type: 'double' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Roles([Role.User])
  @UseInterceptors(FilesInterceptor('file'))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
    @Req() req,
  ) {
    // console.log(body);
    const user_id = req.user.user_id;
    return await this.postingService.create(
      user_id,
      files,
      body.content,
      body.longitude,
      body.latitude,
      body.forFriend,
    );
  }

  @Get('/near')
  @Roles([Role.User])
  async getPostByLocation(@Body() body, @Req() req) {
    // console.log(body);
    const user_id = req.user.user_id;
    return await this.postingService.getNearPost(
      user_id,
      body.latitude,
      body.longitude,
    );
  }
}
