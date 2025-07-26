import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThemeService } from './game-theme.service';
import { ThemeController } from './game-theme.controller';
import { Theme } from './entities/game-theme.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Theme])],
  providers: [ThemeService],
  controllers: [ThemeController],
})
export class GameThemeModule {}
