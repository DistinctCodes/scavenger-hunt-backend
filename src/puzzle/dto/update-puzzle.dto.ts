import { PartialType } from '@nestjs/swagger';
import { CreatePuzzleDto } from './create-puzzle.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePuzzleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
