import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PuzzleService } from '../puzzle/puzzle.service';
import { GamesService } from '../games/games.service';

@Injectable()
export class DeveloperService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => PuzzleService))
    private readonly puzzleService: PuzzleService,
    @Inject(forwardRef(() => GamesService))
    private readonly gamesService: GamesService,
  ) {}

  async resetUserState(userId: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Reset user progress, achievements, etc.
    await this.usersService.resetUserProgress(userId);
    await this.gamesService.resetUserGames(userId);

    return { message: 'User state reset successfully' };
  }

  async seedPuzzles(puzzles: any[]) {
    return this.puzzleService.seedPuzzles(puzzles);
  }

  async resetGameState(gameId: string) {
    const game = await this.gamesService.findOne(gameId);
    if (!game) {
      throw new NotFoundException(`Game with ID ${gameId} not found`);
    }

    await this.gamesService.resetGame(gameId);
    return { message: 'Game state reset successfully' };
  }

  async getSystemStats() {
    const userCount = await this.usersService.count();
    const puzzleCount = await this.puzzleService.count();
    const gameCount = await this.gamesService.count();

    return {
      users: userCount,
      puzzles: puzzleCount,
      games: gameCount,
    };
  }
}
