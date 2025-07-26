import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DailyChallengeService } from '../daily-challenge.service';

@Injectable()
export class RotationScheduler {
  constructor(private readonly dailyService: DailyChallengeService) {}

  @Cron('0 0 * * *') // every midnight
  async handleDailyRotation() {
    await this.dailyService.getTodayChallenge();
  }
}
