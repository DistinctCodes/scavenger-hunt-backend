import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DailyChallenge } from './daily-challenge.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DailyChallengeService {
  constructor(
    @InjectRepository(DailyChallenge)
    private readonly dailyRepo: Repository<DailyChallenge>,
  ) {}

  async getTodayChallenge(): Promise<DailyChallenge> {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let challenge = await this.dailyRepo.findOne({ where: { date: dateOnly } });

    if (!challenge) {
      challenge = await this.rotateChallenge(dateOnly);
    }

    return challenge;
  }

  private async rotateChallenge(date: Date): Promise<DailyChallenge> {
    const challengeId = await this.pickRandomChallengeId();
    const newChallenge = this.dailyRepo.create({ challengeId, date });
    return await this.dailyRepo.save(newChallenge);
  }

  private async pickRandomChallengeId(): Promise<string> {
    // Replace with your own pool (external or hardcoded)
    const pool = ['challenge1', 'challenge2', 'challenge3'];
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }
}
