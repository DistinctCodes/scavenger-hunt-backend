import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DailyPuzzleService } from './daily-puzzle.service';

@ApiTags('daily-puzzle')
@Controller('daily-puzzle')
export class DailyPuzzleController {
  constructor(private readonly dailyPuzzleService: DailyPuzzleService) {}

  @Get()
  @ApiOperation({ summary: "Get today's daily puzzle" })
  @ApiResponse({ status: 200, description: 'Returns the daily puzzle for today.' })
  async getTodayDailyPuzzle() {
    return this.dailyPuzzleService.getTodayDailyPuzzle();
  }
}
