import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePuzzleDto } from 'src/puzzle/dto/create-puzzle.dto';
import { UpdatePuzzleDto } from 'src/puzzle/dto/update-puzzle.dto';
import { Puzzle, PuzzleStatus } from 'src/puzzle/entities/puzzle.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PuzzleDraftService {
  constructor(
    @InjectRepository(Puzzle)
    private puzzleRepo: Repository<Puzzle>,
  ) {}

  async createDraft(data: CreatePuzzleDto, user: User) {
    const draft = this.puzzleRepo.create({
      ...data,
      status: PuzzleStatus.DRAFT,
      creator: { id: user.id },
    });

    return this.puzzleRepo.save(draft);
  }

  async updateDraft(id: number, data: UpdatePuzzleDto, user: User) {
    const puzzle = await this.puzzleRepo.findOne({
      where: { id, creator: user, status: PuzzleStatus.DRAFT },
    });
    if (!puzzle) throw new NotFoundException('Draft not found or not editable');
    Object.assign(puzzle, data);
    return this.puzzleRepo.save(puzzle);
  }

  async deleteDraft(id: number, user: User) {
    const puzzle = await this.puzzleRepo.findOne({
      where: { id, creator: user, status: PuzzleStatus.DRAFT },
    });
    if (!puzzle)
      throw new NotFoundException('Draft not found or not deletable');
    return this.puzzleRepo.remove(puzzle);
  }

  async publishDraft(id: number, user: User) {
    const puzzle = await this.puzzleRepo.findOne({
      where: { id, creator: user, status: PuzzleStatus.DRAFT },
    });
    if (!puzzle) throw new NotFoundException('Draft not found');
    puzzle.status = PuzzleStatus.PUBLISHED;
    return this.puzzleRepo.save(puzzle);
  }

  async getMyDrafts(user: User) {
    return this.puzzleRepo.find({
      where: { creator: user, status: PuzzleStatus.DRAFT },
    });
  }
}
