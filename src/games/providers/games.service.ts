import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Game } from '../entities/game.entity';
import { GameFilterDto } from '../dto/game-filter.dto';

import { CreateGameDto } from '../dto/create-game.dto';
import { GameCategory } from '../entities/game-category.entity';
import { UpdateGameDto } from '../dto/update-game.dto';
import { Puzzle } from 'src/puzzle/entities/puzzle.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Puzzle)
    private readonly puzzlesRepository: Repository<Puzzle>,

    @InjectRepository(GameCategory)
    private readonly categoryRepository: Repository<GameCategory>,
  ) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    // Check if game with same slug exists
    const existingGame = await this.gameRepository.findOne({
      where: { slug: createGameDto.slug },
    });

    if (existingGame) {
      throw new ConflictException('Game with this slug already exists');
    }

    const game = this.gameRepository.create({
      name: createGameDto.name,
      slug: createGameDto.slug,
      description: createGameDto.description,
      difficulty: createGameDto.difficulty,
      estimatedCompletionTime: createGameDto.estimatedCompletionTime,
      coverImage: createGameDto.coverImage,
      isActive: createGameDto.isActive ?? true,
      isFeatured: createGameDto.isFeatured ?? false,
    });

    if (createGameDto.categoryIds) {
      const categories = await this.categoryRepository.findByIds(
        createGameDto.categoryIds,
      );
      game.categories = categories;
    }

    return this.gameRepository.save(game);
  }

  async findAll(filterDto: GameFilterDto): Promise<Game[]> {
    const { search, difficulty, isActive, isFeatured, categoryIds } = filterDto;

    const queryBuilder = this.gameRepository
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
    return this.gameRepository.find({
      where: { isFeatured: true, isActive: true },
      relations: ['categories'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return game;
  }

  async findBySlug(slug: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { slug },
      relations: ['categories'],
    });

    if (!game) {
      throw new NotFoundException(`Game with slug ${slug} not found`);
    }

    return game;
  }

  async remove(id: string): Promise<void> {
    const game = await this.findOne(id);
    await this.gameRepository.remove(game);
  }

  async getGameStats(id: string): Promise<any> {
    const game = await this.findOne(id);

    // Get total puzzles count
    const puzzlesCount = await this.puzzlesRepository.count({
      where: { id: id },
    });

    // Get total points available in the game
    const pointsResult = await this.puzzlesRepository
      .createQueryBuilder('puzzle')
      .select('SUM(puzzle.points)', 'totalPoints')
      .where('puzzle.gameId = :gameId', { gameId: id })
      .getRawOne();

    const totalPoints = Number.parseInt(pointsResult.totalPoints) || 0;

    // Get user completion stats
    const progressStats = await this.gameRepository.query(
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

  async update(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findOne(id);

    // Check if slug is being changed and if it's already taken
    if (updateGameDto.slug && updateGameDto.slug !== game.slug) {
      const existingGame = await this.gameRepository.findOne({
        where: { slug: updateGameDto.slug },
      });

      if (existingGame) {
        throw new ConflictException('Game with this slug already exists');
      }
    }

    // Update basic properties
    Object.assign(game, {
      name: updateGameDto.name,
      slug: updateGameDto.slug,
      description: updateGameDto.description,
      difficulty: updateGameDto.difficulty,
      estimatedCompletionTime: updateGameDto.estimatedCompletionTime,
      coverImage: updateGameDto.coverImage,
      isActive: updateGameDto.isActive,
      isFeatured: updateGameDto.isFeatured,
    });

    // Update categories if provided
    if (updateGameDto.categoryIds) {
      const categories = await this.categoryRepository.findByIds(
        updateGameDto.categoryIds,
      );
      game.categories = categories;
    }

    return this.gameRepository.save(game);
  }

  async recalculateGameStats(id: string): Promise<Game> {
    const game = await this.findOne(id);

    // Get total puzzles count
    const puzzlesCount = await this.puzzlesRepository.count({
      where: { id: id },
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

    return this.gameRepository.save(game);
  }

  async resetGame(gameId: string): Promise<void> {
    const game = await this.findOne(gameId);
    game.status = 'pending';
    game.currentLevel = 1;
    game.score = 0;
    game.completedPuzzles = [];
    await this.gameRepository.save(game);
  }

  async resetUserGames(userId: string): Promise<void> {
    const userGames = await this.gameRepository.find({ where: { userId } });
    for (const game of userGames) {
      await this.resetGame(game.id);
    }
  }

  async count(): Promise<number> {
    return this.gameRepository.count();
  }
}
