import { Controller, Get } from '@nestjs/common';
import { DailyChallengeService } from './daily-challenge.service';

@Controller('daily-challenge')
export class DailyChallengeController {
  constructor(private readonly service: DailyChallengeService) {}

  @Get()
  async getTodayChallenge() {
    return this.service.getTodayChallenge();
  }
}
