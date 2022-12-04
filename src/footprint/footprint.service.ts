import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Footprint } from './footprint.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Posting } from 'src/posting/posting.entity';

@Injectable()
export class FootprintService {
    constructor(
        @InjectRepository(Footprint)
        private footprintRepository: Repository<Footprint>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Posting)
        private postingRepository: Repository<Posting>
    ) { }

    // 발자국 수 추가
    async addFootprint(user_id: string, post_id: string) {
        const user = await this.userRepository.findOneBy({
            user_id: user_id,
        });
        const post = await this.postingRepository.findOneBy({
            post_id: post_id,
        });

        if (user == null) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: '유저가 존재하지 않습니다.',
            });
        }
        if (post == null) {
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: '게시글이 존재하지 않습니다.',
            });
        }

        const isRead = await this.footprintRepository
            .createQueryBuilder('footprint')
            .where('footprint.user_id = :user_id', { user_id })
            .andWhere('footprint.post_id = :post_id', { post_id })
            .getOne();

        if (isRead == null) {
            return await this.footprintRepository
                .createQueryBuilder('footprint')
                .insert()
                .into(Footprint)
                .values([
                    { user_id: user },
                    { post_id: post },
                ])
                .execute();
        }
    }

    // 발자국 수 조회
    async getFootprints(post_id: string) {
        const post = await this.footprintRepository
            .createQueryBuilder('footprint')
            .where('footprint.post_id = :post_id', { post_id })
            .getOne();

        if (post == null)
            throw new BadRequestException({
                status: HttpStatus.BAD_REQUEST,
                message: '게시글이 존재하지 않습니다.',
            });

        return await this.footprintRepository
            .createQueryBuilder('footprint')
            .select('footprint.user_id')
            .getCount();
    }
}
