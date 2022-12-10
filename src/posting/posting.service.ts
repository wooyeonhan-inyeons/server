import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Posting } from './posting.entity';
import * as AWS from 'aws-sdk';
import { S3Service } from 'src/s3/s3.service';
import { UserService } from 'src/user/user.service';
import { Image } from 'src/image/image.entity';
import { FootprintService } from 'src/footprint/footprint.service';
import { RequestUpdatePostDto } from 'src/admin/dto/RequestUpdatePost.dto';
import { EmotionService } from 'src/emotion/emotion.service';
import { Emotion } from 'src/emotion/emotion.entity';
import { pbkdf2 } from 'crypto';
@Injectable()
export class PostingService {
  private readonly awsS3: AWS.S3;

  constructor(
    @InjectRepository(Posting)
    private postingRepository: Repository<Posting>,

    @InjectRepository(Emotion)
    private emotionRepository: Repository<Emotion>,

    private s3Service: S3Service,
    private userService: UserService,
    private footprintService: FootprintService,
    private emotionService: EmotionService,
  ) {}

  async create(
    user_id: string,
    files: Express.Multer.File[],
    content: string,
    longitude: number,
    latitude: number,
    forFriend: number,
  ) {
    const user = await this.userService.findOne(user_id);
    const files_url = await this.s3Service.uploadFile(files);
    const images = files_url.map((url) => {
      const image = new Image();
      image.img_url = url;
      return image;
    });
    const post = this.postingRepository.create({
      user_id: user,
      longitude: longitude,
      latitude: latitude,
      forFriend: forFriend,
      content: content,
      image: images,
    });

    return await this.postingRepository.save(post);
  }
  /*

user_id와 좌표값을 받아서
forFriend = 1 이고 게시물을 올린 user와 친구인 게시물과
forFriend = 0 인 게시물 중에
반경 500m 이내인 게시물 반환

*/

  async getNearPost(user_id: string, latitude: number, longitude: number) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoin('post.user_id', 'user')
      .leftJoin('user.following', 'following')
      .leftJoin('user.follower', 'follower')
      .leftJoin('post.footprint', 'footprint')
      .select('post.post_id')
      .addSelect('post.created_time')
      .addSelect('post.forFriend')
      .addSelect('post.latitude')
      .addSelect('post.longitude')
      .where(
        new Brackets((qb) => {
          qb.where(
            'following.followingUserId = :user_id AND following.relation_type = 1 AND post.forFriend = 1',
            { user_id },
          )
            .orWhere(
              'follower.followerUserId = :user_id AND follower.relation_type = 1 AND post.forFriend = 1',
              { user_id },
            )
            .orWhere('post.forFriend = 0')
            .orWhere('post.user_id = :user_id', { user_id });
        }),
      )
      .addSelect(
        `
        CASE 
        WHEN footprint.user_id = "${user_id}" THEN 1
        ELSE 0
        END
      `,
        'viewed',
      )
      .addSelect(
        `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`,
        'distance',
      )
      .having(`distance <= ${0.5}`)
      .orderBy('distance', 'ASC');

    let queryResult = await query.getRawAndEntities();
    // const queryContainsViewed = await query.getRawMany();
    // console.log(await query.getRawAndEntities());
    let result = [];
    queryResult.entities.forEach((post, i) => {
      result.push({ ...post, viewed: queryResult.raw[i]?.viewed });
    });
    return result;
  }

  async getViewedPost(user_id: string, page: number) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoin('post.footprint', 'footprint')
      .leftJoinAndSelect('post.image', 'image')
      .select('post.post_id')
      .addSelect('image.img_url')
      .where('footprint.user_id = :user_id', { user_id })
      .take(15)
      .skip(15 * page)
      .getMany();

    const result = [];
    query.forEach((post) => {
      result.push({
        post_id: post.post_id,
        img_url: post.image[0].img_url,
      });
    });
    return result;
  }

  async getPost(
    reader_id: string,
    post_id: string,
    latitude: number,
    longitude: number,
  ) {
    let query = this.postingRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user_id', 'user')
      .leftJoin('user.following', 'following')
      .leftJoin('user.follower', 'follower')
      .leftJoin('post.footprint', 'footprint')
      .leftJoinAndSelect('post.image', 'image')
      .loadRelationCountAndMap('post.footprint_count', 'post.footprint')
      .loadRelationCountAndMap(
        'post.like_count',
        'post.emotion',
        'like',
        (qb) => qb.where('like.emotion_type = 0'),
      )
      .loadRelationCountAndMap(
        'post.cool_count',
        'post.emotion',
        'cool',
        (qb) => qb.where('cool.emotion_type = 1'),
      )
      .loadRelationCountAndMap('post.sad_count', 'post.emotion', 'sad', (qb) =>
        qb.where('sad.emotion_type = 2'),
      )
      .where('post.post_id=:post_id', { post_id })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'following.followingUserId = :reader_id AND following.relation_type = 1 AND post.forFriend = 1',
            { reader_id },
          )
            .orWhere(
              'follower.followerUserId = :reader_id AND follower.relation_type = 1 AND post.forFriend = 1',
              { reader_id },
            )
            .orWhere('post.forFriend = 0')
            .orWhere('post.user_id = :reader_id', { reader_id });
        }),
      )
      .addSelect(
        `
        CASE 
        WHEN footprint.user_id = "${reader_id}" THEN 1
        ELSE 0
        END
      `,
        'viewed',
      );

    let postWithoutDistance = await query.getRawOne();
    // console.log(postWithoutDistance);
    /*
        50m 밖에서도 조회가능한 게시물
        1. 본인 게시물일때
        2. 이미 한번 확인한 게시물일때
    */
    if (
      postWithoutDistance.post_userIdUserId == reader_id ||
      postWithoutDistance.viewed == 1
    ) {
      query
        .addSelect(
          `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`,
          'distance',
        )
        .orderBy('distance', 'ASC');
    } else {
      query
        .addSelect(
          `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`,
          'distance',
        )
        .having(`distance <= ${0.05}`)
        .orderBy('distance', 'ASC');
    }

    const conditionalPost = await query.getOne();
    if (conditionalPost == null)
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: '50m 이내 게시물만 조회할 수 있거나, 친구가 아닙니다.',
      });

    const distance = (await query.getRawOne())?.distance;
    const emotion = await this.emotionRepository
      .createQueryBuilder('emotion')
      .leftJoin('emotion.user_id', 'user')
      .leftJoin('emotion.post_id', 'post')
      .where('user.user_id = :reader_id', { reader_id })
      .where('post.post_id = :post_id', { post_id })
      .getOne();
    const owner = conditionalPost.user_id.user_id === reader_id;
    const { user_id, ...result } = conditionalPost;

    /* 발자국 추가 */
    await this.footprintService.addFootprint(reader_id, post_id);

    return { ...result, emotion: { ...emotion }, distance, owner };
  }

  async getAllPost(user_id: string, page: number) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user_id', 'user')
      .leftJoinAndSelect('post.image', 'image')
      .select('post.post_id')
      .addSelect('image.img_url')
      .where('user.user_id = :user_id', { user_id })
      .take(15)
      .skip(15 * page)
      .getMany();

    // 대표사진만
    const result = [];
    query.forEach((post) => {
      result.push({
        post_id: post.post_id,
        img_url: post.image[0].img_url,
      });
    });
    return result;
  }

  async deletePost(user_id: string, post_id: string) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .where('post.user_id=:user_id', { user_id })
      .andWhere('post.post_id=:post_id', { post_id })
      .getOne();

    if (query == null)
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '잘못된 요청입니다.',
      });

    return await this.postingRepository.delete({ post_id });
  }

  /* Admin 전용 API */

  async getAllPost_Admin() {
    let posts: any = await this.postingRepository.find({
      relations: {
        user_id: true,
      },
      select: {
        post_id: true,
        user_id: {
          user_id: true,
          name: true,
        },
        content: true,
        latitude: true,
        longitude: true,
        forFriend: true,
      },
    });

    posts = posts.map((post) => ({
      ...post,
      user_id: post.user_id.user_id,
      name: post.user_id.name,
    }));

    return posts;
  }

  async updatePost_Admin(post: RequestUpdatePostDto) {
    let posts = await this.postingRepository.find({
      where: {
        post_id: post.post_id,
      },
    });

    const updated_post = { ...posts, ...post };

    return await this.postingRepository.save(updated_post);
  }

  async deletePost_Admin(post_id: string) {
    return await this.postingRepository.delete({ post_id });
  }
}
