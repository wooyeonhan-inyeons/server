import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestCreateUserDto } from 'src/user/dto/RequestCreateUser.dto';
import { RequestUpdateUserDto } from './dto/RequestUpdateUser.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository
      .createQueryBuilder('user')
      // .andWhere('following.relation_type = 1')
      .loadRelationCountAndMap(
        'user.follower_count',
        'user.follower',
        'follower',
        (qb) => qb.where('follower.relation_type = 1'),
      )
      .loadRelationCountAndMap(
        'user.following_count',
        'user.following',
        'following',
        (qb) => qb.where('following.relation_type = 1'),
      )
      .getMany();
  }

  async findOne(user_id: string): Promise<User> {
    return await this.usersRepository
      .createQueryBuilder('user')
      .where('user.user_id = :user_id', { user_id })
      // .andWhere('following.relation_type = 1')
      .loadRelationCountAndMap(
        'user.follower_count',
        'user.follower',
        'follower',
        (qb) => qb.where('follower.relation_type = 1'),
      )
      .loadRelationCountAndMap(
        'user.following_count',
        'user.following',
        'following',
        (qb) => qb.where('following.relation_type = 1'),
      )
      .getOne();
  }

  async update(user_id: string, userData: RequestUpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
    var userToUpdate = { ...user, ...userData };
    return await this.usersRepository.save(userToUpdate);
  }

  async delete(userID: string): Promise<void> {
    await this.usersRepository.delete(userID);
  }

  async create(userData: RequestCreateUserDto) {
    const user = this.usersRepository.create(userData);
    return await this.usersRepository.insert(user);
  }
}
