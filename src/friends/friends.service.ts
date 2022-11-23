import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Friends } from './friends.entity';
@Injectable()
export class FriendsService {
    constructor(
        @InjectRepository(Friends)
        private friendsRepository: Repository<Friends>,

        @InjectRepository(User)
        private userRepository: Repository<User>,
      ) {}

      async createRelation(follower_uuid: string, following_uuid: string){
        const follower = await this.userRepository.findOneBy({
          user_id: follower_uuid
        })
        const following = await this.userRepository.findOneBy({
          user_id: following_uuid
        })

        const relation = this.friendsRepository.create({
          follower, following, relation_type: 0
        })
        return await this.friendsRepository.insert(relation);
      }

      async getFriendsList(user_id: string){
      //   const follower = await this.friendsRepository.find({
      //     relations: {
      //       following: true
      //     },
      //     select: {
      //       follower: {
      //         name: true,
      //         user_id: true
      //       }
      //     },
      //     where: {
      //       follower: {
      //         user_id: user_id
      //       }
      //     }
      //   })

      //   const following = await this.friendsRepository.find({
      //     relations: {
      //       follower: true
      //     },
      //     select: ['relation_type AS rt'],
      //     where: {
      //       following: {
      //         user_id: user_id
      //       }
      //     }
      //   })

      //   console.log(follower, following)

      //   return [...follower, ...following]
      }
}






