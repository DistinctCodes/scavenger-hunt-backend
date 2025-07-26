import { PartialType } from '@nestjs/swagger';
import { CreateDailyChallengeDto } from './create-daily-challenge.dto';

export class UpdateDailyChallengeDto extends PartialType(CreateDailyChallengeDto) {}
