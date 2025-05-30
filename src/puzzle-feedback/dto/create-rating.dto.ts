import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsInt()
  puzzleId: number;
}
