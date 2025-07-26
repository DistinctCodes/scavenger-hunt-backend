import { Test, TestingModule } from '@nestjs/testing';
import { ContributionService } from './contribution.service';

describe('ContributionService', () => {
  let service: ContributionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContributionService],
    }).compile();

    service = module.get<ContributionService>(ContributionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
