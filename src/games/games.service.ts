import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { GameCategory } from './entities/game-category.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GameCategory)
    private categoryRepository: Repository<GameCategory>,
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

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find({
      where: { isActive: true },
      relations: ['categories'],
    });
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

  async remove(id: string): Promise<void> {
    const game = await this.findOne(id);
    await this.gameRepository.remove(game);
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
