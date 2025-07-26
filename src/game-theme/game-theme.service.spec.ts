import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ThemeService } from './game-theme.service';
import { Theme } from './entities/game-theme.entity';

describe('ThemeService', () => {
  let service: ThemeService;
  let repository: Repository<Theme>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThemeService,
        {
          provide: getRepositoryToken(Theme),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ThemeService>(ThemeService);
    repository = module.get<Repository<Theme>>(getRepositoryToken(Theme));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTheme', () => {
    it('should return a theme', async () => {
      const theme = new Theme();
      theme.primaryColor = '#FF5733';
      jest.spyOn(repository, 'findOne').mockResolvedValue(theme);

      const result = await service.getTheme();
      expect(result).toBe(theme);
    });

    it('should throw an error if theme is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.getTheme();
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
