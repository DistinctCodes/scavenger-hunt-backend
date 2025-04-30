import { NotFoundException } from "@nestjs/common"
import { Between, Like, type FindOptionsWhere } from "typeorm"
import type { Game } from "./entities/game.entity"
import type { UpdateGameDto } from "./dto/update-game.dto"
import type { QueryGamesDto } from "./dto/query-games.dto"

export class GamesService {
  constructor(private gamesRepository: any) {}

  async create(createGameDto: any): Promise<any> {
    const game = this.gamesRepository.create(createGameDto)
    return this.gamesRepository.save(game)
  }

  async findAll(queryDto: QueryGamesDto): Promise<{ games: Game[]; total: number }> {
    const where: FindOptionsWhere<Game> = {}

    if (queryDto.title) {
      where.title = Like(`%${queryDto.title}%`)
    }

    if (queryDto.genre) {
      where.genre = queryDto.genre
    }

    if (queryDto.releaseDateFrom && queryDto.releaseDateTo) {
      where.releaseDate = Between(queryDto.releaseDateFrom, queryDto.releaseDateTo)
    } else if (queryDto.releaseDateFrom) {
      where.releaseDate = Between(queryDto.releaseDateFrom, new Date())
    }

    if (queryDto.ratingMin) {
      where.rating = Between(queryDto.ratingMin, 10)
    }

    if (queryDto.featured !== undefined) {
      where.featured = queryDto.featured
    }

    const [games, total] = await this.gamesRepository.findAndCount({
      where,
      order: { releaseDate: "DESC" },
      take: queryDto.limit,
      skip: queryDto.offset,
    })

    return { games, total }
  }

  async findRecent(limit = 10): Promise<Game[]> {
    return this.gamesRepository.find({
      order: { releaseDate: "DESC" },
      take: limit,
    })
  }

  async findFeatured(limit = 10): Promise<Game[]> {
    return this.gamesRepository.find({
      where: { featured: true },
      order: { releaseDate: "DESC" },
      take: limit,
    })
  }

  async findOne(id: number): Promise<Game> {
    const game = await this.gamesRepository.findOne({ where: { id } })
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`)
    }
    return game
  }

  async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    const game = await this.findOne(id)
    this.gamesRepository.merge(game, updateGameDto)
    return this.gamesRepository.save(game)
  }

  async remove(id: number): Promise<void> {
    const game = await this.findOne(id)
    await this.gamesRepository.remove(game)
  }
}
