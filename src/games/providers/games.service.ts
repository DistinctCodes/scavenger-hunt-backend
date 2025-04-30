import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Game } from '../entities/game.entity';
import { GameFilterDto } from '../dto/game-filter.dto';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
  ) {}

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
}
