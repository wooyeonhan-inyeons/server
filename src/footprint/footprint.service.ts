import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Footprint } from './footprint.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Posting } from 'src/posting/posting.entity';
import { UserNotFoundException } from 'src/exception/UserNotFound.exception';
import { PostNotFoundException } from 'src/exception/PostNotFound.exception';

@Injectable()
export class FootprintService {
  constructor(
    @InjectRepository(Footprint)
    private footprintRepository: Repository<Footprint>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Posting)
    private postingRepository: Repository<Posting>,
  ) {}

  // 발자국 수 추가
  async addFootprint(user_id: string, post_id: string) {
    const user = await this.userRepository.findOneBy({
      user_id,
    });
    const post = await this.postingRepository.findOne({
      relations: {
        user_id: true,
      },
      where: {
        post_id,
      },
    });

    if (user == null) {
      throw new UserNotFoundException();
    }
    if (post == null) {
      throw new PostNotFoundException();
    }

    //본인 게시물 조회 미포함
    if (post.user_id.user_id == user.user_id) return;

    const isRead = await this.footprintRepository
      .createQueryBuilder('footprint')
      .where('footprint.user_id = :user_id', { user_id })
      .andWhere('footprint.post_id = :post_id', { post_id })
      .getOne();

    // 이미 읽었으면 미포함
    if (isRead != null) return;

    const fp = this.footprintRepository.create({
      user_id: user,
      post_id: post,
    });

    return await this.footprintRepository.save(fp);
  }

  // 발자국 수 조회
  async getFootprints(post_id: string) {
    const count = await this.footprintRepository
      .createQueryBuilder('footprint')
      .where('footprint.post_id = :post_id', { post_id })
      .getCount();

    return count;
  }
}
