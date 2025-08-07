import { IsUUID, IsInt, Min, Max, IsString, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The UUID of the challenge being reviewed',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  challengeId: string;

  @ApiProperty({
    description: 'Rating from 1 to 5 stars',
    minimum: 1,
    maximum: 5,
    example: 4,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @ApiProperty({
    description: 'Optional review comment',
    maxLength: 1000,
    example: 'Great puzzle! Really challenging but fair.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}