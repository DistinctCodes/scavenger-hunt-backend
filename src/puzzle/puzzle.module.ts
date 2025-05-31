import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleService } from './puzzle.service';
import { Puzzle } from './entities/puzzle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Puzzle])],
  providers: [PuzzleService],
  exports: [PuzzleService],
})
export class PuzzleModule {}
