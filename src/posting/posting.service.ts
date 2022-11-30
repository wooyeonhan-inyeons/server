import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from 'src/friends/friends.entity';
import { User } from 'src/user/user.entity';
import { QueryBuilder, Repository } from 'typeorm';
import { Posting } from './posting.entity';


@Injectable()
export class PostingService {
    constructor(
        @InjectRepository(Posting)
        private postingRepository: Repository<Posting>,

        @InjectRepository(Friends)
        private friendsRepository: Repository<Friends>
      ) {}

      async getPostingById(post_id: string): Promise<Posting>{ //post_id를 통해 posting에 있는 데이터를 끌어옴
        const found = await this.postingRepository.findOne({
          where: {
            post_id
          }
        })
        if(!found) throw new NotFoundException();

        return this.postingRepository.findOne({
          where: {
            post_id,
          },
        });
      }

      async getAllPostings(user_id: string): Promise<Posting[]>{ //user_id를 통해 그 유저가 작성한 posting들을 끌어옴
        
        const queryBuilder = this.postingRepository.createQueryBuilder('posting');
        queryBuilder.where('posting.user_id=:user_id',{user_id: user_id});
        const postings = await queryBuilder.getMany();

        return postings;
      }

      async deletePosting(post_id: string): Promise<void>{ //post_id를 사용해 그 게시물 삭제함
        const result = await this.postingRepository.delete({post_id});
      }

      async checkFriend(user_id: string, friend_id: string): Promise<Friends>{ //궁금한점: follower = friend_id && following = user_id도 만들어야하는지..?
        const isFriend = await this.friendsRepository
        .createQueryBuilder('friend')
        .where('friend.follower =: user_id',{user_id: user_id})
        .andWhere('friend.following =: friend_id', {friend_id: friend_id})
        .andWhere('friend.relation_type=1')
        .getOne();

        return isFriend;
      }
  


}

