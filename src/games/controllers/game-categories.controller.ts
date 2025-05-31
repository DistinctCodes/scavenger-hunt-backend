import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { GameCategoriesService } from '../providers/game-categories.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@ApiTags('Game Categories')
@ApiBearerAuth()
@Controller('game-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.DEVELOPER, Role.ADMIN)
export class GameCategoriesController {
  constructor(private readonly categoriesService: GameCategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new game category' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all game categories' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a game category by ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a game category' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a game category' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }

  @Get(':id/games')
  @ApiOperation({ summary: 'Get all games in a category' })
  findGamesByCategory(@Param('id') id: string) {
    return this.categoriesService.findGamesByCategory(id);
  }
}
