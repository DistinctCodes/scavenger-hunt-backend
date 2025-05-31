import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameCategory } from '../entities/game-category.entity';
import { Game } from '../entities/game.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class GameCategoriesService {
  constructor(
    @InjectRepository(GameCategory)
    private readonly categoriesRepository: Repository<GameCategory>,
    @InjectRepository(Game)
    private readonly gamesRepository: Repository<Game>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<GameCategory> {
    // Check if category with same name exists
    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoriesRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(): Promise<GameCategory[]> {
    return this.categoriesRepository.find({
      where: { isActive: true },
    });
  }

  async findOne(id: string): Promise<GameCategory> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<GameCategory> {
    const category = await this.findOne(id);

    // Check if name is being changed and if it's already taken
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    Object.assign(category, {
      name: updateCategoryDto.name,
      description: updateCategoryDto.description,
      isActive: updateCategoryDto.isActive,
    });

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  async findGamesByCategory(categoryId: string): Promise<Game[]> {
    const category = await this.findOne(categoryId);

    const games = await this.gamesRepository
      .createQueryBuilder('game')
      .innerJoin('game.categories', 'category', 'category.id = :categoryId', {
        categoryId,
      })
      .leftJoinAndSelect('game.categories', 'allCategories')
      .where('game.isActive = :isActive', { isActive: true })
      .orderBy('game.name', 'ASC')
      .getMany();

    return games;
  }
}
