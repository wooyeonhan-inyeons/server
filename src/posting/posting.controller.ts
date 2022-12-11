import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { query } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ImageNotExistException } from 'src/exception/ImageNotExist.exception';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestCreatePostingDto } from './dto/RequestCreatePosting.dto';
import { RequestDeletePostingDto } from './dto/RequestDeletePosting.dto';
import { RequestGetAllPostDto } from './dto/RequestGetAllPost.dto';
import { RequestGetOnePostDto } from './dto/RequestGetOnePost.dto';
import { RequestGetPostByLocationDto } from './dto/RequestGetPostByLocation.dto';
import { RequestGetViewedPostDto } from './dto/RequestGetViewedPost.dto';
import { ResponseGetAllPostDto } from './dto/ResponseGetAllPost.dto';
import { ResponseGetOnePostDto } from './dto/ResponseGetOnePost.dto';
import { ResponseGetPostByLocation } from './dto/ResponseGetPostByLocation.dto';
import { ResponseGetUserInfoDto } from './dto/ResponseGetUserInfo.dto';
import { ResponseGetViewedPostDto } from './dto/ResponseGetViewedPost.dto';
import { PostingService } from './posting.service';

@ApiTags('posting')
@ApiBearerAuth()
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
  @ApiOperation({
    summary: '우연을 생성합니다.',
  })
  @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       content: { type: 'string' },
  //       forFriend: { type: 'integer' },
  //       longtitude: { type: 'double' },
  //       latitude: { type: 'double' },
  //       file: {
  //         type: 'string',
  //         format: 'binary',
  //       },
  //     },
  //   },
  // })
  @Roles([Role.User])
  @UseInterceptors(
    FilesInterceptor('file', null, {
      limits: {
        files: 10,
        fileSize: 1024 * 1024 * 20,
      },
      fileFilter: (request, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          // 이미지 형식은 jpg, jpeg, png만 허용합니다.
          callback(null, true);
        } else {
          callback(
            new HttpException(
              '이미지 형식은 jpg, jpeg, png, gif만 허용합니다.',
              400,
            ),
            false,
          );
        }
      },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: RequestCreatePostingDto,
    @Req() req,
  ) {
    console.log(files);
    if (files.length == 0) throw new ImageNotExistException();
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

  @Get()
  @ApiOperation({
    summary:
      '하나의 우연을 조회합니다. 반경 50m 안에 있어야됩니댜. (단, 작성자 및 한번 확인한 사용자는 거리 상관없이 가능)',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetOnePostDto,
  })
  @Roles([Role.User])
  async getOnePost(@Query() query: RequestGetOnePostDto, @Req() req) {
    const user_id = req.user.user_id;
    const { post_id, latitude, longitude } = query;
    return await this.postingService.getPost(
      user_id,
      post_id,
      latitude,
      longitude,
    );
  }

  @Get('/userInfo')
  @ApiOperation({
    summary: '친구 수, 받은 감정 수, 게시물 수 반환',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetUserInfoDto,
  })
  @Roles([Role.User])
  async getMyPage(@Req() req) {
    return await this.postingService.getMyPage(req.user.user_id);
  }

  @Get('/all')
  @ApiOperation({
    summary: '본인의 전체 우연을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetAllPostDto,
    isArray: true,
  })
  @Roles([Role.User])
  async getAllPost(@Req() req, @Query() query: RequestGetAllPostDto) {
    const user_id = req.user.user_id;
    const { page } = query;
    return await this.postingService.getAllPost(user_id, page);
  }

  @Get('/viewed')
  @ApiOperation({
    summary: '한번 본 우연을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetViewedPostDto,
    isArray: true,
  })
  @Roles([Role.User])
  async getViewedPost(@Req() req, @Query() query: RequestGetViewedPostDto) {
    const user_id = req.user.user_id;
    const { page } = query;
    return await this.postingService.getViewedPost(user_id, page);
  }

  @Get('/near')
  @ApiOperation({
    summary: '반경 500m 이내의 우연들을 조회합니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    type: ResponseGetPostByLocation,
  })
  @Roles([Role.User])
  async getPostByLocation(
    @Query() query: RequestGetPostByLocationDto,
    @Req() req,
  ) {
    const user_id = req.user.user_id;
    const { latitude, longitude } = query;
    return await this.postingService.getNearPost(user_id, latitude, longitude);
  }

  @Delete()
  @ApiOperation({
    summary: '우연을 삭제합니다.',
  })
  @Roles([Role.User])
  async deletePost(@Body() body: RequestDeletePostingDto, @Req() req) {
    const user_id = req.user.user_id;
    return await this.postingService.deletePost(user_id, body.post_id);
  }
}
