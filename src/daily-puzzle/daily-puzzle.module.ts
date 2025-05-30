import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyPuzzle } from './entities/daily-puzzle.entity';
import { DailyPuzzleService } from './daily-puzzle.service';
import { DailyPuzzleController } from './daily-puzzle.controller';
import { Game } from '../games/entities/game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DailyPuzzle, Game])],
  providers: [DailyPuzzleService],
  controllers: [DailyPuzzleController],
  exports: [DailyPuzzleService],
})
export class DailyPuzzleModule {}
