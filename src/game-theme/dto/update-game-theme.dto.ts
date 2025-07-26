import { PartialType } from '@nestjs/swagger';
import { CreateThemeDto } from './create-game-theme.dto';

export class UpdateGameThemeDto extends PartialType(CreateThemeDto) {}
