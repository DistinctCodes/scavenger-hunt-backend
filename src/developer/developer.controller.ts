import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { DeveloperService } from './developer.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Developer')
@ApiBearerAuth()
@Controller('dev')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DEVELOPER, Role.ADMIN)
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @Post('reset-user/:id')
  @ApiOperation({ summary: 'Reset user state' })
  async resetUserState(@Param('id') userId: string) {
    return this.developerService.resetUserState(userId);
  }

  @Post('seed-puzzles')
  @ApiOperation({ summary: 'Seed puzzles' })
  async seedPuzzles(@Body() puzzles: any[]) {
    return this.developerService.seedPuzzles(puzzles);
  }

  @Post('reset-game/:id')
  @ApiOperation({ summary: 'Reset game state' })
  async resetGameState(@Param('id') gameId: string) {
    return this.developerService.resetGameState(gameId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get system statistics' })
  async getSystemStats() {
    return this.developerService.getSystemStats();
  }
}
