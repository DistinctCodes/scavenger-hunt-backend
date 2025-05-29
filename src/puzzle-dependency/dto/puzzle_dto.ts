import { IsString, IsOptional, IsInt, IsBoolean, Min, Max, IsArray, ArrayNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePuzzleDto {
  @IsString()
  code: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  difficulty?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number = 0;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}

export class UpdatePuzzleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  difficulty?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  points?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AddDependencyDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  puzzleId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  prerequisiteId: number;

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean = true;
}

export class AddMultipleDependenciesDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  puzzleId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @Transform(({ value }) => value.map((id: any) => parseInt(id)))
  prerequisiteIds: number[];

  @IsOptional()
  @IsBoolean()
  isRequired?: boolean = true;
}

export class CompletePuzzleDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  userId: number;

  @IsInt()
  @Transform(({ value }) => parseInt(value))
  puzzleId: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  score?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  timeSpent?: number;

  @IsOptional()
  @IsString()
  solution?: string;
}

export class PuzzleAccessResponseDto {
  hasAccess: boolean;
  puzzle?: any;
  missingPrerequisites?: string[];
  completedPrerequisites?: string[];
  message: string;
}

export class DependencyGraphDto {
  nodes: { id: number; code: string; title: string; completed?: boolean }[];
  edges: { from: number; to: number }[];
}