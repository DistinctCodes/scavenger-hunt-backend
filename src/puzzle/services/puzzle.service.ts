import { Injectable } from '@nestjs/common';
import { CreatePuzzleDto } from '../dto/create-puzzle.dto';
import { UpdatePuzzleDto } from '../dto/update-puzzle.dto';
import { Repository } from 'typeorm';
import { Puzzle, PuzzleStatus } from '../entities/puzzle.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PuzzleService {
  constructor(
    @InjectRepository(Puzzle)
    private puzzleRepo: Repository<Puzzle>,
  ) {}
  create(createPuzzleDto: CreatePuzzleDto) {
    return 'This action adds a new puzzle';
  }

  findAll() {
    return `This action returns all puzzle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} puzzle`;
  }

  update(id: number, updatePuzzleDto: UpdatePuzzleDto) {
    return `This action updates a #${id} puzzle`;
  }

  remove(id: number) {
    return `This action removes a #${id} puzzle`;
  }

  async getPublishedPuzzles() {
    return this.puzzleRepo.find({
      where: { status: PuzzleStatus.PUBLISHED },
      relations: ['creator'],
    });
  }
}
