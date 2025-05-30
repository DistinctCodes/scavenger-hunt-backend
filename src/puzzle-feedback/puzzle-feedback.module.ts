import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuzzleFeedbackService } from './puzzle-feedback.service';
import { PuzzleFeedbackController } from './puzzle-feedback.controller';
import { PuzzleRating } from './entities/puzzle-rating.entity';
import { Puzzle } from 'src/puzzle-engine/entities/puzzle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PuzzleRating, Puzzle])],
  providers: [PuzzleFeedbackService],
  controllers: [PuzzleFeedbackController],
})
export class PuzzleFeedbackModule {}
