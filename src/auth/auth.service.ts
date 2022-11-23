import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/libs/enums/role.enum';
import { User } from 'src/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { profile } from 'console';
import { userInfo } from 'os';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private adminService: AdminService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async validateAdmin(id: string, pw: string): Promise<any> {
    const user = await this.adminService.findOne(id);
    if (user && user.pw === pw) {
      const { pw, ...result } = user;
      return result;
    }
    return null;
  }

  async adminLogin(user: any) {
    const payload = { id: user.id, role: Role.Admin };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async userLogin(user: any) {
    let userInfo = await this.userRepository.findOneBy({
      email: user.email
    })

    if(userInfo){ // 유저정보가 존재할 시
      const payload = { user_id: userInfo.user_id, name: userInfo.name, email: userInfo.email, role: Role.User };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    else{ // 신규 유저
      const new_user = await this.userService.create({
        name: user.name,
        email: user.email
      })
      const payload = { user_id: new_user.identifiers[0].user_id, name: user.name, email: user.email, role: Role.User };
      
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}
