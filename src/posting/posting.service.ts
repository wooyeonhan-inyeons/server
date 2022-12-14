import { Injectable } from '@nestjs/common';
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
import { BadRequestException } from 'src/exception/BadRequest.exception';
import { PostAccessFailedException } from 'src/exception/PostAccessFailed.exception';
import { FriendsService } from 'src/friends/friends.service';
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
    private friendsService: FriendsService,
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

  async getMyPage(user_id: string) {
    const posting_count = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoin('post.user_id', 'user')
      .where('user.user_id = :user_id', { user_id })
      .getCount();

    const friend_list = await this.friendsService.getFriendsList(user_id);

    const emotion_count = await this.emotionRepository
      .createQueryBuilder('emotion')
      .leftJoin('emotion.user_id', 'user')
      .leftJoin('emotion.post_id', 'post')
      .where('post.user_id=:user_id', { user_id })
      // .where('user.user_id = :user_id', { user_id })
      .getCount();

    return {
      posting_count,
      friend_count: friend_list.follower.length + friend_list.following.length,
      emotion_count,
    };
  }
  /*

user_id??? ???????????? ?????????
forFriend = 1 ?????? ???????????? ?????? user??? ????????? ????????????
forFriend = 0 ??? ????????? ??????
?????? 500m ????????? ????????? ??????

*/

  async getNearPost(user_id: string, latitude: number, longitude: number) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoin('post.user_id', 'user')
      .leftJoin('user.following', 'following')
      .leftJoin('user.follower', 'follower')
      .leftJoin('post.footprint', 'footprint')
      .leftJoin('footprint.user_id', 'footprint_user')
      .select('post.post_id')
      .addSelect('post.created_time')
      .addSelect('post.forFriend')
      .addSelect('post.latitude')
      .addSelect('post.longitude')
      .addSelect('footprint_user')
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
      .having(`distance <= ${1}`)
      .orderBy('distance', 'ASC');

    let queryResult = await query.getRawAndEntities();

    let result = [];
    queryResult.entities.forEach((post_info, i) => {
      const viewed = queryResult.raw.find((rawPost) => {
        const post = rawPost.post_post_id;
        const user = rawPost.footprint_user_user_id;
        console.log(post, user);
        return post == post_info.post_id && user == user_id;
      })
        ? 1
        : 0;
      console.log(viewed);
      result.push({
        ...post_info,
        viewed,
      });
    });
    return result;
  }

  async getAccessableNearPost(
    user_id: string,
    latitude: number,
    longitude: number,
  ) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoin('post.user_id', 'user')
      .leftJoin('user.following', 'following')
      .leftJoin('user.follower', 'follower')
      .leftJoin('post.footprint', 'footprint')
      .select('post.post_id')
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
      .having(`distance <= ${0.05}`)
      .orderBy('distance', 'ASC');

    let queryResult: any = await query.getMany();
    let result = [];
    for (let i = 0; i < queryResult.length; i++) {
      const post_info = await this.getPost(
        user_id,
        queryResult[i].post_id,
        latitude,
        longitude,
      );
      result.push(post_info);
    }

    return result;
  }

  async getViewedPost(user_id: string, page: number) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoin('post.footprint', 'footprint')
      .leftJoinAndSelect('post.image', 'image')
      .select('post.post_id')
      .addSelect('post.created_time')
      .addSelect('image.img_url')
      .where('footprint.user_id = :user_id', { user_id })
      .orderBy({ 'post.created_time': 'DESC' })
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
        50m ???????????? ??????????????? ?????????
        1. ?????? ???????????????
        2. ?????? ?????? ????????? ???????????????
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
    if (conditionalPost == null) throw new PostAccessFailedException();

    const distance = (await query.getRawOne())?.distance;
    const emotion = await this.emotionRepository
      .createQueryBuilder('emotion')
      .leftJoin('emotion.user_id', 'user')
      .leftJoin('emotion.post_id', 'post')
      .where('user.user_id = :reader_id', { reader_id })
      .andWhere('post.post_id = :post_id', { post_id })
      .getOne();
    const owner = conditionalPost.user_id.user_id === reader_id;
    const { user_id, ...result } = conditionalPost;

    // console.log(await this.footprintService.isViewed(user_id.user_id, post_id));
    /* ????????? ?????? */
    if (!(await this.footprintService.isViewed(reader_id, post_id)))
      await this.footprintService.addFootprint(reader_id, post_id);

    return { ...result, emotion: { ...emotion }, distance, owner };
  }

  async getAllPost(user_id: string, page: number) {
    let query = await this.postingRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user_id', 'user')
      .leftJoinAndSelect('post.image', 'image')
      .select('post.post_id')
      .addSelect('post.created_time')
      .addSelect('image.img_url')
      .where('user.user_id = :user_id', { user_id })
      .orderBy({ 'post.created_time': 'DESC' })
      .take(15)
      .skip(15 * page)
      .getMany();

    // ???????????????
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

    if (query == null) throw new BadRequestException();

    return await this.postingRepository.delete({ post_id });
  }

  /* Admin ?????? API */

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
