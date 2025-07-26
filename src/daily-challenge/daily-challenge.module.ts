import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyChallenge } from './entities/daily-challenge.entity';
import { DailyChallengeService } from './daily-challenge.service';
import { DailyChallengeController } from './daily-challenge.controller';
import { RotationScheduler } from './scheduler/rotation.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([DailyChallenge])],
  controllers: [DailyChallengeController],
  providers: [DailyChallengeService, RotationScheduler],
})
export class DailyChallengeModule {}
