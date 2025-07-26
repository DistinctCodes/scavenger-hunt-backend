import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theme } from './entities/game-theme.entity';
import { CreateThemeDto } from './dto/create-game-theme.dto';
import { UpdateGameThemeDto } from './dto/update-game-theme.dto';


@Injectable()
export class ThemeService {
  constructor(
    @InjectRepository(Theme)
    private readonly themeRepository: Repository<Theme>,
  ) {}

  async getTheme(): Promise<Theme> {
    const theme = await this.themeRepository.findOne();
    if (!theme) {
      throw new NotFoundException('Theme configuration not found');
    }
    return theme;
  }

  async createTheme(createThemeDto: CreateThemeDto): Promise<Theme> {
    const theme = this.themeRepository.create(createThemeDto);
    return this.themeRepository.save(theme);
  }

  async updateTheme(updateThemeDto: UpdateGameThemeDto): Promise<Theme> {
    const theme = await this.themeRepository.findOne();
    if (!theme) {
      throw new NotFoundException('Theme configuration not found');
    }

    Object.assign(theme, updateThemeDto);
    return this.themeRepository.save(theme);
  }
}
