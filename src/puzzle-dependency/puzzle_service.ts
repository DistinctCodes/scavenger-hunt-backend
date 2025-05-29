import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner, DataSource } from 'typeorm';
import { Puzzle, PuzzleDependency, UserPuzzleCompletion } from './entities/puzzle-dependency.entity';
import { DependencyGraphService, GraphNode } from './graph_service';
import { AddDependencyDto, AddMultipleDependenciesDto, CompletePuzzleDto, CreatePuzzleDto, DependencyGraphDto, PuzzleAccessResponseDto, UpdatePuzzleDto } from './dto/puzzle_dto';

@Injectable()
export class PuzzleDependencyService {
  constructor(
    @InjectRepository(Puzzle)
    private puzzleRepository: Repository<Puzzle>,
    @InjectRepository(PuzzleDependency)
    private dependencyRepository: Repository<PuzzleDependency>,
    @InjectRepository(UserPuzzleCompletion)
    private completionRepository: Repository<UserPuzzleCompletion>,
    private dependencyGraphService: DependencyGraphService,
    private dataSource: DataSource,
  ) {}

  async createPuzzle(createPuzzleDto: CreatePuzzleDto): Promise<Puzzle> {
    const existingPuzzle = await this.puzzleRepository.findOne({
      where: { code: createPuzzleDto.code }
    });

    if (existingPuzzle) {
      throw new ConflictException(`Puzzle with code '${createPuzzleDto.code}' already exists`);
    }

    const puzzle = this.puzzleRepository.create(createPuzzleDto);
    return await this.puzzleRepository.save(puzzle);
  }

  async updatePuzzle(id: number, updatePuzzleDto: UpdatePuzzleDto): Promise<Puzzle> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }

    Object.assign(puzzle, updatePuzzleDto);
    return await this.puzzleRepository.save(puzzle);
  }

  async getPuzzle(id: number): Promise<Puzzle> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${id} not found`);
    }
    return puzzle;
  }

  async getAllPuzzles(): Promise<Puzzle[]> {
    return await this.puzzleRepository.find({
      where: { isActive: true },
      order: { difficulty: 'ASC', createdAt: 'ASC' }
    });
  }

  async addDependency(addDependencyDto: AddDependencyDto): Promise<PuzzleDependency> {
    const { puzzleId, prerequisiteId, isRequired } = addDependencyDto;

    if (puzzleId === prerequisiteId) {
      throw new BadRequestException('A puzzle cannot depend on itself');
    }

    // Verify both puzzles exist
    const [puzzle, prerequisite] = await Promise.all([
      this.puzzleRepository.findOne({ where: { id: puzzleId } }),
      this.puzzleRepository.findOne({ where: { id: prerequisiteId } })
    ]);

    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);
    }
    if (!prerequisite) {
      throw new NotFoundException(`Prerequisite puzzle with ID ${prerequisiteId} not found`);
    }

    // Check if dependency already exists
    const existingDependency = await this.dependencyRepository.findOne({
      where: { puzzleId, prerequisiteId }
    });

    if (existingDependency) {
      throw new ConflictException('Dependency already exists');
    }

    // Check for circular dependencies
    await this.validateNoCycles(puzzleId, prerequisiteId);

    const dependency = this.dependencyRepository.create({
      puzzleId,
      prerequisiteId,
      isRequired: isRequired ?? true
    });

    return await this.dependencyRepository.save(dependency);
  }

  async addMultipleDependencies(dto: AddMultipleDependenciesDto): Promise<PuzzleDependency[]> {
    const { puzzleId, prerequisiteIds, isRequired } = dto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const results: PuzzleDependency[] = [];

      for (const prerequisiteId of prerequisiteIds) {
        if (puzzleId === prerequisiteId) {
          throw new BadRequestException('A puzzle cannot depend on itself');
        }

        // Check if dependency already exists
        const existingDependency = await queryRunner.manager.findOne(PuzzleDependency, {
          where: { puzzleId, prerequisiteId }
        });

        if (!existingDependency) {
          // Validate no cycles before adding
          await this.validateNoCycles(puzzleId, prerequisiteId, queryRunner);

          const dependency = queryRunner.manager.create(PuzzleDependency, {
            puzzleId,
            prerequisiteId,
            isRequired: isRequired ?? true
          });

          const saved = await queryRunner.manager.save(PuzzleDependency, dependency);
          results.push(saved);
        }
      }

      await queryRunner.commitTransaction();
      return results;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async removeDependency(puzzleId: number, prerequisiteId: number): Promise<void> {
    const result = await this.dependencyRepository.delete({
      puzzleId,
      prerequisiteId
    });

    if (result.affected === 0) {
      throw new NotFoundException('Dependency not found');
    }
  }

  async getPuzzleDependencies(puzzleId: number): Promise<Puzzle[]> {
    const dependencies = await this.dependencyRepository.find({
      where: { puzzleId },
      order: { createdAt: 'ASC' }
    });

    const prerequisiteIds = dependencies.map(dep => dep.prerequisiteId);
    if (prerequisiteIds.length === 0) return [];

    return await this.puzzleRepository.findByIds(prerequisiteIds);
  }

  async checkPuzzleAccess(userId: number, puzzleId: number): Promise<PuzzleAccessResponseDto> {
    const puzzle = await this.puzzleRepository.findOne({ where: { id: puzzleId } });
    if (!puzzle) {
      throw new NotFoundException(`Puzzle with ID ${puzzleId} not found`);
    }

    if (!puzzle.isActive) {
      return {
        hasAccess: false,
        message: 'This puzzle is currently inactive',
        missingPrerequisites: [],
        completedPrerequisites: []
      };
    }

    // Get all dependencies
    const dependencies = await this.getPuzzleDependencies(puzzleId);
    if (dependencies.length === 0) {
      return {
        hasAccess: true,
        puzzle,
        message: 'Access granted - no prerequisites required',
        missingPrerequisites: [],
        completedPrerequisites: []
      };
    }

    // Get user's completed puzzles
    const completions = await this.completionRepository.find({
      where: { userId }
    });
    const completedPuzzleIds = completions.map(c => c.puzzleId);

    // Check which prerequisites are missing
    const missingPrerequisites: string[] = [];
    const completedPrerequisites: string[] = [];

    for (const dep of dependencies) {
      if (completedPuzzleIds.includes(dep.id)) {
        completedPrerequisites.push(dep.code);
      } else {
        missingPrerequisites.push(dep.code);
      }
    }

    const hasAccess = missingPrerequisites.length === 0;

    return {
      hasAccess,
      puzzle: hasAccess ? puzzle : undefined,
      missingPrerequisites,
      completedPrerequisites,
      message: hasAccess 
        ? 'Access granted - all prerequisites completed'
        : `Access denied - missing prerequisites: ${missingPrerequisites.join(', ')}`
    };
  }

  async completePuzzle(dto: CompletePuzzleDto): Promise<UserPuzzleCompletion> {
    const { userId, puzzleId, score, timeSpent, solution } = dto;

    // Verify puzzle exists and user has access
    const accessResult = await this.checkPuzzleAccess(userId, puzzleId);
    if (!accessResult.hasAccess) {
      throw new BadRequestException(accessResult.message);
    }

    // Check if already completed
    const existingCompletion = await this.completionRepository.findOne({
      where: { userId, puzzleId }
    });

    if (existingCompletion) {
      throw new ConflictException('Puzzle already completed by this user');
    }

    const completion = this.completionRepository.create({
      userId,
      puzzleId,
      score,
      timeSpent,
      solution
    });

    return await this.completionRepository.save(completion);
  }

  async getUserCompletions(userId: number): Promise<UserPuzzleCompletion[]> {
    return await this.completionRepository.find({
      where: { userId },
      order: { completedAt: 'DESC' }
    });
  }

  async getUserProgress(userId: number): Promise<{
    completed: number;
    total: number;
    available: number;
    percentage: number;
    nextAvailable: Puzzle[];
  }> {
    const [allPuzzles, completions] = await Promise.all([
      this.getAllPuzzles(),
      this.getUserCompletions(userId)
    ]);

    const completedIds = completions.map(c => c.puzzleId);
    const completed = completions.length;
    const total = allPuzzles.length;

    // Find next available puzzles
    const nextAvailable: Puzzle[] = [];
    for (const puzzle of allPuzzles) {
      if (!completedIds.includes(puzzle.id)) {
        const access = await this.checkPuzzleAccess(userId, puzzle.id);
        if (access.hasAccess) {
          nextAvailable.push(puzzle);
        }
      }
    }

    return {
      completed,
      total,
      available: nextAvailable.length,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      nextAvailable
    };
  }

  async getDependencyGraph(userId?: number): Promise<DependencyGraphDto> {
    const puzzles = await this.getAllPuzzles();
    const dependencies = await this.dependencyRepository.find();

    let completedIds: number[] = [];
    if (userId) {
      const completions = await this.getUserCompletions(userId);
      completedIds = completions.map(c => c.puzzleId);
    }

    const nodes = puzzles.map(puzzle => ({
      id: puzzle.id,
      code: puzzle.code,
      title: puzzle.title,
      completed: userId ? completedIds.includes(puzzle.id) : undefined
    }));

    const edges = dependencies.map(dep => ({
      from: dep.prerequisiteId,
      to: dep.puzzleId
    }));

    return { nodes, edges };
  }

  private async validateNoCycles(puzzleId: number, prerequisiteId: number, queryRunner?: QueryRunner): Promise<void> {
    const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;
    
    const [puzzles, dependencies] = await Promise.all([
      manager.find(Puzzle),
      manager.find(PuzzleDependency)
    ]);

    // Build graph nodes
    const nodeMap = new Map<number, GraphNode>();
    puzzles.forEach(puzzle => {
      nodeMap.set(puzzle.id, {
        id: puzzle.id,
        code: puzzle.code,
        title: puzzle.title,
        dependencies: []
      });
    });

    // Add existing dependencies
    dependencies.forEach(dep => {
      if (nodeMap.has(dep.puzzleId)) {
        nodeMap.get(dep.puzzleId)!.dependencies.push(dep.prerequisiteId);
      }
    });

    const nodes = Array.from(nodeMap.values());

    // Check if adding this dependency would create a cycle
    const wouldCreateCycle = this.dependencyGraphService.detectCircularDependency(
      nodes,
      puzzleId,
      prerequisiteId
    );

    if (wouldCreateCycle) {
      throw new BadRequestException('Adding this dependency would create a circular reference');
    }
  }
}