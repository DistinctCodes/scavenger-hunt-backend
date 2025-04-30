import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from "@nestjs/common"
import type { GamesService } from "./games.service"
import type { CreateGameDto } from "./dto/create-game.dto"
import type { UpdateGameDto } from "./dto/update-game.dto"
import type { QueryGamesDto } from "./dto/query-games.dto"

@Controller("games")
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  findAll(@Query() queryDto: QueryGamesDto) {
    return this.gamesService.findAll(queryDto);
  }

  @Get('recent')
  findRecent(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.gamesService.findRecent(limit);
  }

  @Get('featured')
  findFeatured(@Query('limit', new ParseIntPipe({ optional: true })) limit?: number) {
    return this.gamesService.findFeatured(limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.findOne(id);
  }

  @Patch(":id")
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gamesService.remove(id);
  }
}
