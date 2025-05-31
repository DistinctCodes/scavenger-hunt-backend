// developer.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';
import { PuzzleModule } from '../puzzle/puzzle.module';
import { GamesModule } from '../games/games.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => PuzzleModule),
    forwardRef(() => GamesModule),
  ],
  controllers: [DeveloperController],
  providers: [DeveloperService],
  exports: [DeveloperService],
})
export class DeveloperModule {}
