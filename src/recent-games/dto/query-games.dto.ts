import { IsOptional, IsString, IsNumber, IsBoolean, IsDate } from "class-validator"
import { Type } from "class-transformer"

export class QueryGamesDto {
  @IsOptional()
  @IsString()
  title?: string

  @IsOptional()
  @IsString()
  genre?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  releaseDateFrom?: Date

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  releaseDateTo?: Date

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ratingMin?: number

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset?: number = 0
}
