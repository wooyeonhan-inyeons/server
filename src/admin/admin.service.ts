import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

//export type Admin = any;

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}
  async findOne(id: string): Promise<Admin | undefined> {
    return this.adminRepository.findOneBy({ id: id });
  }

  async findAll(): Promise<Admin[] | undefined> {
    return this.adminRepository.find();
  }
}
