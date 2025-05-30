import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { PuzzleFeedbackService } from './puzzle-feedback.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('puzzle-feedback')
export class PuzzleFeedbackController {
  constructor(private readonly feedbackService: PuzzleFeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() dto: CreateRatingDto, @Req() req) {
    return this.feedbackService.create(dto, req.user);
  }

  @Get(':puzzleId')
  async getPuzzleRatings(@Param('puzzleId') puzzleId: number) {
    return this.feedbackService.findByPuzzle(puzzleId);
  }
}
