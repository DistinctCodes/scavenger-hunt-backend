import { IsInt, Min, Max, IsOptional, IsString, Length } from 'class-validator';

export class CreateFeedbackDto {
  @IsString()
  challengeId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @Length(5, 500)
  comment?: string;
}
