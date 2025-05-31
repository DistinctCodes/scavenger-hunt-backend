import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './feedback.entity';
import { Repository } from 'typeorm';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly repo: Repository<Feedback>,
  ) {}

  async create(userId: string, dto: CreateFeedbackDto) {
    const feedback = this.repo.create({ ...dto, userId });
    return this.repo.save(feedback);
  }

  async getByChallenge(challengeId: string) {
    return this.repo.find({ where: { challengeId } });
  }
}
