import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(user_id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
  }

  async update(user_id: string, userData: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        user_id,
      },
    });
    var userToUpdate = { ...user, ...userData }
    await this.usersRepository.save(userToUpdate);
  }

  async deleteOne(userID: string): Promise<void> {
    await this.usersRepository.delete(userID);
  }
}
