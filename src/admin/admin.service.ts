import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
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

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, userData: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    var userToUpdate = { ...user, ...userData }
    await this.usersRepository.save(userToUpdate);
  }

  async deleteOne(userID: string): Promise<void> {
    await this.usersRepository.delete(userID);
  }
}
