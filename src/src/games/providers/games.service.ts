import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Game } from '../entities/game.entity';
import { GameFilterDto } from '../dto/game-filter.dto';
import { Puzzle } from '../../puzzle-engine/entities/puzzle.entity';
import { CreateGameDto } from '../dto/create-game.dto';
import { GameCategory } from '../entities/game-category.entity';
import { UpdateGameDto } from '../dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,

        @InjectRepository(Puzzle)
    private readonly puzzlesRepository: Repository<Puzzle>,

        @InjectRepository(GameCategory)
    private readonly categoriesRepository: Repository<GameCategory>,
  ) {}

   async create(createGameDto: CreateGameDto): Promise<Game> {
    // Check if slug already exists
    const existingGame = await this.gamesRepository.findOne({
      where: { slug: createGameDto.slug },
    });

    if (existingGame) {
      throw new ConflictException(
        `Game with slug '${createGameDto.slug}' already exists`,
      );
    }

    // Create new game entity
    const game = this.gamesRepository.create({
      name: createGameDto.name,
      description: createGameDto.description,
      slug: createGameDto.slug,
      coverImage: createGameDto.coverImage,
      isActive: createGameDto.isActive,
      isFeatured: createGameDto.isFeatured,
      difficulty: createGameDto.difficulty,
      estimatedCompletionTime: createGameDto.estimatedCompletionTime,
    });

    // Add categories if provided
    if (createGameDto.categoryIds && createGameDto.categoryIds.length > 0) {
      const categories = await this.categoriesRepository.find({
        where: { id: In(createGameDto.categoryIds) },
      });

      if (categories.length !== createGameDto.categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }

      game.categories = categories;
    }

    return this.gamesRepository.save(game);
  }

  async findAll(filterDto: GameFilterDto): Promise<Game[]> {
    const { search, difficulty, isActive, isFeatured, categoryIds } = filterDto;

    const queryBuilder = this.gamesRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.categories', 'category');

    // Apply filters
    if (search) {
      queryBuilder.andWhere(
        '(game.name ILIKE :search OR game.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (difficulty) {
      queryBuilder.andWhere('game.difficulty = :difficulty', { difficulty });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('game.isActive = :isActive', { isActive });
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('game.isFeatured = :isFeatured', { isFeatured });
    }

    if (categoryIds && categoryIds.length > 0) {
      queryBuilder
        .innerJoin('game.categories', 'cat')
        .andWhere('cat.id IN (:...categoryIds)', { categoryIds });
    }

    // Order by name
    queryBuilder.orderBy('game.name', 'ASC');

    return queryBuilder.getMany();
  }

   async findFeatured(): Promise<Game[]> {
    return this.gamesRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['categories'],
      order: { name: 'ASC' },
    });
  }

   async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return game;
  }

    async findBySlug(slug: string): Promise<Game> {
    const game = await this.gamesRepository.findOne({
      where: { slug },
      relations: ['categories'],
    });

    if (!game) {
      throw new NotFoundException(`Game with slug '${slug}' not found`);
    }

    return game;
  }

   async remove(id: number): Promise<void> {
    const result = await this.gamesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
  }

    async getGameStats(id: number): Promise<any> {
    const game = await this.findOne(id);

    // Get total puzzles count
    const puzzlesCount = await this.puzzlesRepository.count({
      where: { gameId: id },
    });

    // Get total points available in the game
    const pointsResult = await this.puzzlesRepository
      .createQueryBuilder('puzzle')
      .select('SUM(puzzle.points)', 'totalPoints')
      .where('puzzle.gameId = :gameId', { gameId: id })
      .getRawOne();

    const totalPoints = Number.parseInt(pointsResult.totalPoints) || 0;

    // Get user completion stats
    const progressStats = await this.gamesRepository.query(
      `
      SELECT 
        COUNT(DISTINCT user_id) as total_players,
        COUNT(DISTINCT user_id) FILTER (WHERE completed = true) as completions,
        AVG(completion_percentage) as avg_completion_percentage,
        AVG(time_spent) FILTER (WHERE completed = true) as avg_completion_time
      FROM 
        game_progress
      WHERE 
        game_id = $1
    `,
      [id],
    );

    const stats = progressStats[0] || {};

    return {
      id: game.id,
      name: game.name,
      totalPuzzles: puzzlesCount,
      totalPoints,
      totalPlayers: Number.parseInt(stats.total_players) || 0,
      completions: Number.parseInt(stats.completions) || 0,
      avgCompletionPercentage:
        Number.parseFloat(stats.avg_completion_percentage) || 0,
      avgCompletionTimeSeconds:
        Number.parseFloat(stats.avg_completion_time) || 0,
    };
  }

    async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findOne(id);

    // Check if slug is being updated and already exists
    if (updateGameDto.slug && updateGameDto.slug !== game.slug) {
      const existingGame = await this.gamesRepository.findOne({
        where: { slug: updateGameDto.slug },
      });

      if (existingGame) {
        throw new ConflictException(
          `Game with slug '${updateGameDto.slug}' already exists`,
        );
      }
    }

    // Update categories if provided
    if (updateGameDto.categoryIds) {
      const categories = await this.categoriesRepository.find({
        where: { id: In(updateGameDto.categoryIds) },
      });

      if (categories.length !== updateGameDto.categoryIds.length) {
        throw new NotFoundException('One or more categories not found');
      }

      game.categories = categories;
      delete updateGameDto.categoryIds;
    }

    // Update the game properties
    Object.assign(game, updateGameDto);

    return this.gamesRepository.save(game);
  }

    async recalculateGameStats(id: number): Promise<Game> {
    const game = await this.findOne(id);

    // Get total puzzles count
    const puzzlesCount = await this.puzzlesRepository.count({
      where: { gameId: id },
    });

    // Get total points available in the game
    const pointsResult = await this.puzzlesRepository
      .createQueryBuilder('puzzle')
      .select('SUM(puzzle.points)', 'totalPoints')
      .where('puzzle.gameId = :gameId', { gameId: id })
      .getRawOne();

    const totalPoints = Number.parseInt(pointsResult.totalPoints) || 0;

    // Update game stats
    game.totalPuzzles = puzzlesCount;
    game.totalPoints = totalPoints;

    return this.gamesRepository.save(game);
  }
}
