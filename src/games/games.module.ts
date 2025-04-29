import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesController } from './controllers/games.controller';
import { GamesService } from './providers/games.service';
import { Game } from './entities/game.entity';

import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Game,]),
    UsersModule,
  ],
  controllers: [
    GamesController,
  ],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
