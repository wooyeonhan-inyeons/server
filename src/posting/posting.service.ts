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
@Injectable()
export class PostingService {
  private readonly awsS3: AWS.S3;

  constructor(
    @InjectRepository(Posting)
    private postingRepository: Repository<Posting>,
    private s3Service: S3Service,
    private userService: UserService,
  ) {}

  async uploadTest(files: Express.Multer.File[]) {
    const img_list = await this.s3Service.uploadFile(files);
    console.log(img_list);
    // await this.s3Service.uploadFile(file);
  }

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
        `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`,
        'distance',
      )
      .having(`distance <= ${0.5}`)
      .orderBy('distance', 'ASC')
      .getMany();

    return query;
  }

  async getPost(
    user_id: string,
    post_id: string,
    latitude: number,
    longitude: number,
  ) {
    let query = this.postingRepository
      .createQueryBuilder('post')
      .leftJoin('post.user_id', 'user')
      .leftJoin('user.following', 'following')
      .leftJoin('user.follower', 'follower')
      .leftJoinAndSelect('post.image', 'image')
      .where('post.post_id=:post_id', { post_id })
      .andWhere(
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
        `6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))`,
        'distance',
      )
      .having(`distance <= ${0.05}`)
      .orderBy('distance', 'ASC');

    const result = await query.getOne();
    const distance = (await query.getRawOne())?.distance;

    if (result == null)
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: '50m 이내 게시물만 조회할 수 있습니다.',
      });

    return { ...result, distance };
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
}
