import { Controller, Get, Patch, Body } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThemeService } from './game-theme.service';
import { UpdateGameThemeDto } from './dto/update-game-theme.dto';

@ApiTags('Themes')
@Controller('themes')
export class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Get()
  @ApiOperation({ summary: 'Get the current theme configuration' })
  @ApiResponse({ status: 200, description: 'Theme retrieved successfully' })
  async getTheme() {
    return this.themeService.getTheme();
  }

  @Patch()
  @ApiOperation({ summary: 'Update the theme configuration' })
  @ApiResponse({ status: 200, description: 'Theme updated successfully' })
  async updateTheme(@Body() updateThemeDto: UpdateGameThemeDto) {
    return this.themeService.updateTheme(updateThemeDto);
  }
}
