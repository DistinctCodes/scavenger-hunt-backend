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
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Games')
@ApiBearerAuth()
@Controller('games')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DEVELOPER, Role.ADMIN)
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game' })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all games' })
  findAll(@Query() filterDto: GameFilterDto) {
    return this.gamesService.findAll(filterDto);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured games' })
  findFeatured() {
    return this.gamesService.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a game by slug' })
  @ApiParam({ name: 'slug', type: 'string' })
  findBySlug(@Param('slug') slug: string) {
    return this.gamesService.findBySlug(slug);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game' })
  @ApiParam({ name: 'id', type: 'string' })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get game statistics' })
  @ApiParam({ name: 'id', type: 'string' })
  getGameStats(@Param('id') id: string) {
    return this.gamesService.getGameStats(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game' })
  @ApiParam({ name: 'id', type: 'string' })
  update(
    @Param('id') id: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Post(':id/recalculate-stats')
  @ApiOperation({ summary: 'Recalculate game statistics' })
  @ApiParam({ name: 'id', type: 'string' })
  recalculateGameStats(@Param('id') id: string) {
    return this.gamesService.recalculateGameStats(id);
  }

  @Post(':id/reset')
  @ApiOperation({ summary: 'Reset a game' })
  @ApiParam({ name: 'id', type: 'string' })
  resetGame(@Param('id') id: string) {
    return this.gamesService.resetGame(id);
  }

  @Post('user/:userId/reset')
  @ApiOperation({ summary: 'Reset all games for a user' })
  @ApiParam({ name: 'userId', type: 'string' })
  resetUserGames(@Param('userId') userId: string) {
    return this.gamesService.resetUserGames(userId);
  }
}




