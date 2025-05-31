import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Puzzle } from './entities/puzzle.entity';

@Injectable()
export class PuzzleService {
  constructor(
    @InjectRepository(Puzzle)
    private puzzleRepository: Repository<Puzzle>,
  ) {}

  async seedPuzzles(puzzles: Partial<Puzzle>[]): Promise<Puzzle[]> {
    const puzzleEntities = puzzles.map((puzzle) =>
      this.puzzleRepository.create(puzzle),
    );
    return this.puzzleRepository.save(puzzleEntities);
  }

  async count(): Promise<number> {
    return this.puzzleRepository.count();
  }

  async findAll(): Promise<Puzzle[]> {
    return this.puzzleRepository.find();
  }

  async findOne(id: string): Promise<Puzzle> {
    return this.puzzleRepository.findOne({ where: { id } });
  }
}
