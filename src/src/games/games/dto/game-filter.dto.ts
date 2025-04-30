import { IsEnum, IsOptional, IsBoolean, IsString, IsArray } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { GameDifficulty } from "../entities/game.entity"
import { Transform } from "class-transformer"

export class GameFilterDto {
  @ApiPropertyOptional({ description: "Search term for game name or description" })
  @IsString()
  @IsOptional()
  search?: string

  @ApiPropertyOptional({
    description: "Game difficulty level",
    enum: GameDifficulty,
  })
  @IsEnum(GameDifficulty)
  @IsOptional()
  difficulty?: GameDifficulty

  @ApiPropertyOptional({ description: "Filter by active status" })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true
    if (value === "false") return false
    return value
  })
  isActive?: boolean

  @ApiPropertyOptional({ description: "Filter by featured status" })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === "true") return true
    if (value === "false") return false
    return value
  })
  isFeatured?: boolean

  @ApiPropertyOptional({ description: "Filter by category IDs" })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.split(",").map(Number) : value))
  categoryIds?: number[]
}
