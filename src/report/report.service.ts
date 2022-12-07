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
  ) {}

  /* 신고 종류 ()
    0: 심한 욕설  1: 혐오 발언  2: 도배 
    3: 선정적인 게시물  4: 도박성 게시물  5: 광고성 게시물 */

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

    // 본인 게시물 신고 미포함
    if (user.user_id == post.user_id.user_id)
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '본인 게시물은 신고 할 수 없습니다.',
      });

    // report_type이 달라도 user, post id가 존재하면 이미 신고됨
    const isReported = await this.reportRepository
      .createQueryBuilder('report')
      .where('report.user_id = :user_id', { user_id })
      .andWhere('report.post_id = :post_id', { post_id })
      .getOne();

    // 이미 신고했으면 미포함
    if (isReported != null)
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        message: '이미 신고를 했습니다.',
      });

    // 테이블에 저장
    const rp = this.reportRepository.create({
      report_type: report_type,
      user_id: user,
      post_id: post,
    });

    return await this.reportRepository.save(rp);
  }

  /* Admin 전용 API */
  async getAllReport_Admin() {
    const result: any = await this.reportRepository.find({
      select: {
        report_id: true,
        user_id: {
          name: true,
        },
        post_id: {
          post_id: true,
          user_id: {
            name: true,
          },
        },
        report_type: true,
      },
      relations: {
        user_id: true,
        post_id: {
          user_id: true,
        },
      },
    });
    return result.map((report) => ({
      report_id: report.report_id,
      post_id: report.post_id.post_id,
      reporter_name: report.user_id.name,
      author_name: report.post_id.user_id.name,
      report_type: report.report_type,
    }));
  }

  async deleteReport_Admin(report_id: string) {
    return await this.reportRepository.delete({ report_id });
  }
}
