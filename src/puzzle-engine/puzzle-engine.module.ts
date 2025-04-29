import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Puzzle } from "./entities/puzzle.entity"
import { UsersModule } from "../users/users.module"
import { GamesModule } from "../games/games.module"
import { UserPuzzleProgress } from "./entities/user-puzzle-progress.entity"

@Module({
  imports: [TypeOrmModule.forFeature([Puzzle, UserPuzzleProgress]), UsersModule, GamesModule],
})
export class PuzzleEngineModule {}
