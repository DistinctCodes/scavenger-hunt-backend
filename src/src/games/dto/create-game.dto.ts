import { IsString, IsOptional, IsBoolean, IsEnum, IsInt, IsArray, Min, ArrayNotEmpty } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { GameDifficulty } from "../entities/game.entity"

export class CreateGameDto {
  @ApiProperty({ description: "Game name" })
  @IsString()
  name: string

  @ApiPropertyOptional({ description: "Game description" })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ description: "Game slug for URLs" })
  @IsString()
  slug: string

  @ApiPropertyOptional({ description: "Cover image URL" })
  @IsString()
  @IsOptional()
  coverImage?: string

  @ApiPropertyOptional({ description: "Whether the game is active" })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true

  @ApiPropertyOptional({ description: "Whether the game is featured" })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean = false

  @ApiPropertyOptional({
    description: "Game difficulty level",
    enum: GameDifficulty,
    default: GameDifficulty.INTERMEDIATE,
  })
  @IsEnum(GameDifficulty)
  @IsOptional()
  difficulty?: GameDifficulty = GameDifficulty.INTERMEDIATE

  @ApiPropertyOptional({ description: "Estimated completion time in minutes" })
  @IsInt()
  @Min(1)
  @IsOptional()
  estimatedCompletionTime?: number

  @ApiPropertyOptional({ description: "Category IDs for the game" })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsOptional()
  categoryIds?: number[]
}
