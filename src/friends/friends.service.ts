import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyFriendException } from 'src/exception/AlreadyFriend.exception';
import { BadRequestException } from 'src/exception/BadRequest.exception';
import { FriendAlreadyRequestedException } from 'src/exception/FriendAlreadyRequested.exception';
import { UserNotFoundException } from 'src/exception/UserNotFound.exception';
import { User } from 'src/user/user.entity';
import { Brackets, Repository } from 'typeorm';
import { Friends } from './friends.entity';
@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //친구 신청
  async createRelation(follower_uuid: string, following_uuid: string) {
    const follower = await this.userRepository.findOneBy({
      user_id: follower_uuid,
    });
    const following = await this.userRepository.findOneBy({
      user_id: following_uuid,
    });

    if (follower == null || following == null)
      throw new UserNotFoundException();

    const isRequested = await this.friendsRepository
      .createQueryBuilder('friend')
      .where('friend.follower = :follower_uuid', { follower_uuid })
      .andWhere('friend.following = :following_uuid', { following_uuid })
      .andWhere('friend.relation_type = 0')
      .getOne();

    if (isRequested != null) throw new FriendAlreadyRequestedException();

    const isFriend = await this.friendsRepository
      .createQueryBuilder('friend')
      .where(
        new Brackets((qb) => {
          qb.where('friend.follower = :follower_uuid', { follower_uuid })
            .andWhere('friend.follower = :following_uuid', { following_uuid })
            .andWhere('friend.relation_type = 1');
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where('friend.following = :following_uuid', { following_uuid })
            .andWhere('friend.following = :follower_uuid', { follower_uuid })
            .andWhere('friend.relation_type = 1');
        }),
      )
      .getOne();
    if (isFriend != null) throw new AlreadyFriendException();

    const relation = this.friendsRepository.create({
      follower,
      following,
      relation_type: 0,
    });
    return await this.friendsRepository.insert(relation);
  }

  //친구 목록 조회
  async getFriendsList(user_id: string) {
    const follower = await this.friendsRepository.find({
      relations: {
        follower: true,
      },
      select: {
        friend_id: true,
        follower: {
          user_id: true,
          name: true,
          message: true,
        },
      },
      where: {
        following: {
          user_id: user_id,
        },
        relation_type: 1,
      },
    });

    const following = await this.friendsRepository.find({
      relations: {
        following: true,
      },
      select: {
        friend_id: true,
        following: {
          user_id: true,
          name: true,
          message: true,
        },
      },
      where: {
        follower: {
          user_id: user_id,
        },
        relation_type: 1,
      },
    });

    return { follower, following };
  }

  //친구 요청 수락
  async acceptFriendRequest(user_id: string, friend_id: string) {
    const friend_request = await this.friendsRepository.findOne({
      relations: {
        follower: true,
        following: true,
      },
      where: {
        friend_id,
      },
    });

    //신청받은 사람이 아니면 못받음
    if (friend_request.following?.user_id != user_id)
      throw new BadRequestException();

    if (friend_request?.relation_type == 1) throw new AlreadyFriendException();

    friend_request.relation_type = 1;
    return await this.friendsRepository.save(friend_request);
  }

  //친구 요청 거절
  async declineFriendRequest(user_id: string, friend_id: string) {
    const friend_request = await this.friendsRepository.findOne({
      relations: {
        follower: true,
        following: true,
      },
      where: {
        friend_id,
      },
    });

    //신청받은 사람이 아니면 못받음
    if (friend_request.following?.user_id != user_id)
      throw new BadRequestException();

    return await this.friendsRepository.delete({ friend_id });
  }

  // 요청받은 친구 목록 조회
  async getFriendRequestList(user_id: string) {
    return await this.friendsRepository.find({
      select: {
        follower: {
          user_id: true,
          name: true,
        },
        friend_id: true,
        created_at: true,
      },
      relations: {
        follower: true,
      },
      where: {
        following: {
          user_id: user_id,
        },
        relation_type: 0,
      },
    });
  }

  // 요청한 친구 목록 조회
  async getRequestedFriendList(user_id: string) {
    return await this.friendsRepository.find({
      select: {
        following: {
          user_id: true,
          name: true,
        },
        friend_id: true,
      },
      relations: {
        following: true,
      },
      where: {
        follower: {
          user_id: user_id,
        },
        relation_type: 0,
      },
    });
  }

  async getFriendInfoSum(user_id: string) {
    const friend_list = await this.getFriendsList(user_id);
    const request_list = await this.getFriendRequestList(user_id);

    return {
      friend_count: friend_list.follower.length + friend_list.following.length,
      request_count: request_list.length,
    };
  }

  async deleteFriend(user_id: string, friend_id: string) {
    const isFollower = await this.friendsRepository.findBy({
      follower: {
        user_id: user_id,
      },
      friend_id,
    });

    const isFollowing = await this.friendsRepository.findBy({
      following: {
        user_id: user_id,
      },
      friend_id,
    });

    //요청한 유저가 포함된 관계인지 조회
    if (!isFollower && !isFollowing) throw new BadRequestException();

    return await this.friendsRepository.delete({
      friend_id,
    });
  }

  async isFriend(follower_uuid: string, following_uuid: string) {
    const isFriend = await this.friendsRepository
      .createQueryBuilder('friend')
      .where(
        new Brackets((qb) => {
          qb.where('friend.follower = :follower_uuid', { follower_uuid })
            .andWhere('friend.follower = :following_uuid', { following_uuid })
            .andWhere('friend.relation_type = 1');
        }),
      )
      .orWhere(
        new Brackets((qb) => {
          qb.where('friend.following = :following_uuid', { following_uuid })
            .andWhere('friend.following = :follower_uuid', { follower_uuid })
            .andWhere('friend.relation_type = 1');
        }),
      )
      .getOne();
    return isFriend != null;
  }

  /* 어드민 전용 API */

  async getAllFriend_Admin() {
    return await this.friendsRepository.find({
      relations: {
        follower: true,
        following: true,
      },
      select: {
        follower: {
          name: true,
        },
        following: {
          name: true,
        },
        friend_id: true,
        relation_type: true,
      },
    });
  }

  async deleteFriend_Admin(friend_id: string) {
    return await this.friendsRepository.delete({
      friend_id,
    });
  }

  async updateRelation_Admin(friend_id: string, relation_type: number) {
    const relation = await this.friendsRepository.findOne({
      where: {
        friend_id,
      },
    });

    relation.relation_type = relation_type;

    return await this.friendsRepository.save(relation);
  }
}
