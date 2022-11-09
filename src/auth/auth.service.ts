import { Injectable } from '@nestjs/common';
import { AdminService } from 'src/admin/admin.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private adminService: AdminService,
        private jwtService : JwtService
        ){}

    async validateAdmin(id: string, pw: string):Promise<any>{
        const user = await this.adminService.findOne(id);
        if(user && user.pw === pw){
            const{pw, ...result} = user;
            return result;
        }
        return null;
    }

    async adminLogin(user: any){
        const payload = { username: user, sub: user.userId};
        return{
            access_token : this.jwtService.sign(payload),
        };
    }

}
