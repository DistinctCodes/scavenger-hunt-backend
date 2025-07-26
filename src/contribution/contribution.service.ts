import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contribution } from './entities/contribution.entity';
import { Repository } from 'typeorm';
import { CreateContributionDto } from './dto/create-contribution.dto';

@Injectable()
export class ContributionsService {
  constructor(
    @InjectRepository(Contribution)
    private readonly repo: Repository<Contribution>,
  ) {}

  async submit(dto: CreateContributionDto): Promise<Contribution> {
    const contribution = this.repo.create({ ...dto });
    return this.repo.save(contribution);
  }

  async getPending() {
    return this.repo.find({ where: { status: 'pending' } });
  }

  async updateStatus(id: string, status: 'approved' | 'rejected') {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Contribution not found');

    item.status = status;
    return this.repo.save(item);
  }
}
