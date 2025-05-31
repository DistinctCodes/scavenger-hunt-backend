import { IsString } from "class-validator";

export class CreatePuzzleDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}