import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/libs/enums/role.enum';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

//export type Admin = any;

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async findOne(id: string): Promise<Admin | undefined> {
    return this.adminRepository.findOneBy({ id: id });
  }

  async findAll(): Promise<Admin[] | undefined> {
    return this.adminRepository.find();
  }

  async getUserAccessToken(user_id: string) {
    let userInfo = await this.userRepository.findOneBy({
      user_id: user_id,
    });

    if (userInfo) {
      // 유저정보가 존재할 시
      const payload = {
        user_id: userInfo.user_id,
        name: userInfo.name,
        email: userInfo.email,
        role: Role.User,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new NotFoundException({
        status: HttpStatus.BAD_REQUEST,
        message: '유저가 존재하지 않습니다.',
      });
    }
  }
}
