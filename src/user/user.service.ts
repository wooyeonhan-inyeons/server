import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestCreateUserDto } from 'src/admin/dto/RequestCreateUser.dto';
import { RequestUpdateUserDto } from 'src/admin/dto/RequestUpdateUser.dto';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  find(user_id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
  }

  async update(user_id: string, userData: RequestUpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
    var userToUpdate = { ...user, ...userData };
    await this.usersRepository.save(userToUpdate);
  }

  async delete(userID: string): Promise<void> {
    await this.usersRepository.delete(userID);
  }

  async create(userData: RequestCreateUserDto) {
    await this.usersRepository.save(userData);
  }
}
