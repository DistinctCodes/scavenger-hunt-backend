import { PartialType } from '@nestjs/swagger';
import { CreateGameDto } from './create-game.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
