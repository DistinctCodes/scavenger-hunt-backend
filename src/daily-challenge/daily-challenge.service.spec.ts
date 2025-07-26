import { Test, TestingModule } from '@nestjs/testing';
import { DailyChallengeService } from './daily-challenge.service';

describe('DailyChallengeService', () => {
  let service: DailyChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyChallengeService],
    }).compile();

    service = module.get<DailyChallengeService>(DailyChallengeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
