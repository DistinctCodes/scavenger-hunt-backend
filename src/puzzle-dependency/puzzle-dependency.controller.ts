import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { PuzzleDependencyService } from './puzzle-dependency.service';
import { Puzzle, PuzzleDependency, UserPuzzleCompletion } from './entities/puzzle-dependency.entity';
import { AddDependencyDto, AddMultipleDependenciesDto, CompletePuzzleDto, CreatePuzzleDto, DependencyGraphDto, PuzzleAccessResponseDto, UpdatePuzzleDto } from './dto/puzzle_dto';

@Controller('puzzles')
export class PuzzleDependencyController {
  constructor(private readonly puzzleDependencyService: PuzzleDependencyService) {}

  @Post()
  async createPuzzle(@Body() createPuzzleDto: CreatePuzzleDto): Promise<Puzzle> {
    return await this.puzzleDependencyService.createPuzzle(createPuzzleDto);
  }

  @Get()
  async getAllPuzzles(): Promise<Puzzle[]> {
    return await this.puzzleDependencyService.getAllPuzzles();
  }

  @Get(':id')
  async getPuzzle(@Param('id', ParseIntPipe) id: number): Promise<Puzzle> {
    return await this.puzzleDependencyService.getPuzzle(id);
  }

  @Put(':id')
  async updatePuzzle(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePuzzleDto: UpdatePuzzleDto
  ): Promise<Puzzle> {
    return await this.puzzleDependencyService.updatePuzzle(id, updatePuzzleDto);
  }

  @Post('dependencies')
  async addDependency(@Body() addDependencyDto: AddDependencyDto): Promise<PuzzleDependency> {
    return await this.puzzleDependencyService.addDependency(addDependencyDto);
  }

  @Post('dependencies/multiple')
  async addMultipleDependencies(@Body() dto: AddMultipleDependenciesDto): Promise<PuzzleDependency[]> {
    return await this.puzzleDependencyService.addMultipleDependencies(dto);
  }

  @Delete('dependencies/:puzzleId/:prerequisiteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDependency(
    @Param('puzzleId', ParseIntPipe) puzzleId: number,
    @Param('prerequisiteId', ParseIntPipe) prerequisiteId: number
  ): Promise<void> {
    return await this.puzzleDependencyService.removeDependency(puzzleId, prerequisiteId);
  }

  @Get(':id/dependencies')
  async getPuzzleDependencies(@Param('id', ParseIntPipe) id: number): Promise<Puzzle[]> {
    return await this.puzzleDependencyService.getPuzzleDependencies(id);
  }

  @Get(':puzzleId/access/:userId')
  async checkPuzzleAccess(
    @Param('puzzleId', ParseIntPipe) puzzleId: number,
    @Param('userId', ParseIntPipe) userId: number
  ): Promise<PuzzleAccessResponseDto> {
    return await this.puzzleDependencyService.checkPuzzleAccess(userId, puzzleId);
  }

  @Post('complete')
  async completePuzzle(@Body() completePuzzleDto: CompletePuzzleDto): Promise<UserPuzzleCompletion> {
    return await this.puzzleDependencyService.completePuzzle(completePuzzleDto);
  }

  @Get('user/:userId/completions')
  async getUserCompletions(@Param('userId', ParseIntPipe) userId: number): Promise<UserPuzzleCompletion[]> {
    return await this.puzzleDependencyService.getUserCompletions(userId);
  }

  @Get('user/:userId/progress')
  async getUserProgress(@Param('userId', ParseIntPipe) userId: number): Promise<{
    completed: number;
    total: number;
    available: number;
    percentage: number;
    nextAvailable: Puzzle[];
  }> {
    return await this.puzzleDependencyService.getUserProgress(userId);
  }

  @Get('graph/dependencies')
  async getDependencyGraph(@Query('userId', ParseIntPipe) userId?: number): Promise<DependencyGraphDto> {
    return await this.puzzleDependencyService.getDependencyGraph(userId);
  }
}
  