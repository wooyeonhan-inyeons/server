import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { Role } from 'src/libs/enums/role.enum';
import { RequestDeletePostingDto } from './dto/RequestDeletePosting.dto';
import { ResponseGetAllPostDto } from './dto/ResponseGetAllPost.dto';
import { ResponseGetOnePostDto } from './dto/ResponseGetOnePost.dto';
import { ResponseGetPostByLocation } from './dto/ResponseGetPostByLocation.dto';
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
  @UseInterceptors(
    FilesInterceptor('file', null, {
      limits: {
        files: 10,
        fileSize: 1024 * 1024 * 20,
      },
    }),
  )
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body,
    @Req() req,
  ) {
    // console.log(body);
    const user_id = req.user.user_id;
    return await this.postingService
      .create(
        user_id,
        files,
        body.content,
        body.longitude,
        body.latitude,
        body.forFriend,
      )
      .catch((err) => {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      });
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
  async getOnePost(
    @Query('post_id') post_id: string,
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Req() req,
  ) {
    const user_id = req.user.user_id;
    return await this.postingService
      .getPost(user_id, post_id, latitude, longitude)
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      });
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
  async getAllPost(@Req() req) {
    const user_id = req.user.user_id;
    return await this.postingService.getAllPost(user_id).catch((err) => {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    });
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
  async getViewedPost(@Req() req) {
    const user_id = req.user.user_id;
    return await this.postingService.getViewedPost(user_id).catch((err) => {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      });
    });
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
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Req() req,
  ) {
    const user_id = req.user.user_id;
    return await this.postingService
      .getNearPost(user_id, latitude, longitude)
      .catch((err) => {
        console.log(err);
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      });
  }

  @Delete()
  @ApiOperation({
    summary: '우연을 삭제합니다.',
  })
  @Roles([Role.User])
  async deletePost(@Body() body: RequestDeletePostingDto, @Req() req) {
    const user_id = req.user.user_id;
    return await this.postingService
      .deletePost(user_id, body.post_id)
      .catch((err) => {
        throw new InternalServerErrorException({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        });
      });
  }
}
