import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleDependencyController } from './puzzle-dependency.controller';
import { PuzzleDependencyService } from './puzzle-dependency.service';
import { Puzzle, PuzzleDependency, UserPuzzleCompletion } from './entities/puzzle-dependency.entity';
import { DependencyGraphService } from './graph_service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Puzzle,
      PuzzleDependency,
      UserPuzzleCompletion
    ]),
  ],
  controllers: [PuzzleDependencyController],
  providers: [
    PuzzleDependencyService,
    DependencyGraphService
  ],
  exports: [
    PuzzleDependencyService,
    DependencyGraphService,
    TypeOrmModule
  ],
})
export class PuzzleDependencyModule {}