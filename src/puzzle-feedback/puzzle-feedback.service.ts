import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PuzzleRating } from './entities/puzzle-rating.entity';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class PuzzleFeedbackService {
  constructor(
    @InjectRepository(PuzzleRating)
    private ratingRepo: Repository<PuzzleRating>,
  ) {}

  async create(dto: CreateRatingDto, user: any): Promise<PuzzleRating> {
    const rating = this.ratingRepo.create({
      rating: dto.rating,
      feedback: dto.feedback,
      puzzleId: dto.puzzleId,
      user,
    });
    return this.ratingRepo.save(rating);
  }

  async findByPuzzle(puzzleId: number): Promise<PuzzleRating[]> {
    return this.ratingRepo.find({
      where: { puzzleId },
      order: { createdAt: 'DESC' },
    });
  }
}
