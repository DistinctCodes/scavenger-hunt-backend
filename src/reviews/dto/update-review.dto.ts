import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { OmitType } from '@nestjs/swagger';

export class UpdateReviewDto extends PartialType(
  OmitType(CreateReviewDto, ['challengeId'] as const)
) {}