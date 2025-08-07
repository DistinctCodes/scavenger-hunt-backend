import { IsOptional, IsUUID, IsInt, Min, Max, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryReviewDto {
  @ApiPropertyOptional({
    description: 'Filter by challenge ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  challengeId?: string;

  @ApiPropertyOptional({
    description: 'Filter by user ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Filter by minimum star rating',
    minimum: 1,
    maximum: 5,
    example: 3,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(5)
  minStars?: number;

  @ApiPropertyOptional({
    description: 'Filter by maximum star rating',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(5)
  maxStars?: number;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    minimum: 1,
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort order (newest, oldest, highest, lowest)',
    enum: ['newest', 'oldest', 'highest', 'lowest'],
    default: 'newest',
    example: 'newest',
  })
  @IsOptional()
  @IsString()
  sort?: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest';
}