import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posting } from 'src/posting/posting.entity';
import { User } from 'src/user/user.entity';
import { Repository, ReturningStatementNotSupportedError } from 'typeorm';
import { Report } from './report.entity';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private reportRepository: Repository<Report>,

        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Posting)
        private postingRepository: Repository<Posting>,
    ) { }

    /* 신고 종류 ()
    0: 심한 욕설  1: 혐오 발언  2: 도배 
    3: 선정적인 게시물  4: 도박성 게시물  5: 광고성 게시물 */

    // 본인 게시글인지 확인
    checkWriter(user, post) {
        // 본인 게시글이면 false
        if (user.user_id == post.user_id.user_id) {
            return false;
        }
        else
            return true;
    }

    // 신고
    async addReport(report_type: number, user_id: string, post_id: string) {
        const user = await this.userRepository.findOneBy({
            user_id,
        });
        const post = await this.postingRepository.findOne({
            relations: {
                user_id: true,
            },
            where: {
                post_id,
            },
        });

        // 유저나 게시글이 존재하지 않을 때
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

        // 본인 게시물 조회 미포함
        if (this.checkWriter) {
            return;
        }

        const isReported = await this.reportRepository
            .createQueryBuilder('report')
            .where('report.user_id = :user_id', { user_id })
            .andWhere('report.post_id = :post_id', { post_id })
            .getOne();

        // 이미 신고했으면 미포함
        if (isReported != null) return;

        // 테이블에 저장
        const rp = this.reportRepository.create({
            report_type: report_type,
            user_id: user,
            post_id: post,
        })

        return await this.reportRepository.save(rp);
    }
}
