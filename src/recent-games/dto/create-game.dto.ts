import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsDate } from "class-validator"
import { Type } from "class-transformer"

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsNotEmpty()
  genre: string

  @IsDate()
  @Type(() => Date)
  releaseDate: Date

  @IsNumber()
  @IsOptional()
  rating?: number

  @IsBoolean()
  @IsOptional()
  featured?: boolean
}
