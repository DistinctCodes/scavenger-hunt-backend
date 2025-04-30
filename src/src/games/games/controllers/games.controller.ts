import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Param,
   Delete,
  UseGuards,
  HttpCode,
  Post,
  Body,
  Patch
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
   ApiParam,
   ApiBearerAuth,
} from '@nestjs/swagger';
import { GamesService } from '../providers/games.service';
import { GameFilterDto } from '../dto/game-filter.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateGameDto } from '../dto/create-game.dto';
import { UpdateGameDto } from '../dto/update-game.dto';

@ApiTags('games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new game' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The game has been successfully created.',
  })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }


  @Get()
  @ApiOperation({ summary: 'Get all games with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all games that match the filter criteria.',
  })
  findAll(@Query() filterDto: GameFilterDto) {
    return this.gamesService.findAll(filterDto);
  }

    @Get('featured')
  @ApiOperation({ summary: 'Get featured games' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return all featured games.',
  })
  findFeatured() {
    return this.gamesService.findFeatured();
  }

    @Get(':id')
  @ApiOperation({ summary: 'Get a game by ID' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the game with the specified ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found.',
  })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(+id);
  }

    @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a game by slug' })
  @ApiParam({ name: 'slug', description: 'Game slug' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return the game with the specified slug.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found.',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.gamesService.findBySlug(slug);
  }

    @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The game has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found.',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.gamesService.remove(+id);
  }

    @Get(':id/stats')
  @ApiOperation({ summary: 'Get game statistics' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return statistics for the specified game.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found.',
  })
  getGameStats(@Param('id') id: string) {
    return this.gamesService.getGameStats(+id);
  }

    @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a game' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The game has been successfully updated.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found.',
  })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto);
  }

  @Post(':id/recalculate-stats')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Recalculate game statistics' })
  @ApiParam({ name: 'id', description: 'Game ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Game statistics recalculated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Game not found.',
  })
  @ApiBearerAuth()
  recalculateGameStats(@Param('id') id: string) {
    return this.gamesService.recalculateGameStats(+id);
  }
}




