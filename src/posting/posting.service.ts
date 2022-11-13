import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posting } from './posting.entity';
@Injectable()
export class PostingService {
    constructor(
        @InjectRepository(Posting)
        private usersRepository: Repository<Posting>,
      ) {}

}

