import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyPuzzle } from './entities/daily-puzzle.entity';
import { Game } from '../games/entities/game.entity';
import { startOfDay, format } from 'date-fns';

@Injectable()
export class DailyPuzzleService {
  constructor(
    @InjectRepository(DailyPuzzle)
    private readonly dailyPuzzleRepository: Repository<DailyPuzzle>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async getTodayDailyPuzzle(): Promise<DailyPuzzle> {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    let dailyPuzzle = await this.dailyPuzzleRepository.findOne({ where: { date: today }, relations: ['game'] });
    if (dailyPuzzle) return dailyPuzzle;

    // Get all active games
    const games = await this.gameRepository.find({ where: { isActive: true } });
    if (!games.length) throw new NotFoundException('No active games available for daily puzzle.');

    // Deterministic rotation: pick game based on day offset
    const dayIndex = Math.floor((new Date().getTime() - new Date('2020-01-01').getTime()) / (1000 * 60 * 60 * 24));
    const selectedGame = games[dayIndex % games.length];

    dailyPuzzle = this.dailyPuzzleRepository.create({ date: today, game: selectedGame });
    await this.dailyPuzzleRepository.save(dailyPuzzle);
    return dailyPuzzle;
  }
}
