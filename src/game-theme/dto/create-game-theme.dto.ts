import { IsString, IsOptional, IsHexColor, IsUrl } from 'class-validator';

export class CreateThemeDto {
  @IsHexColor()
  @IsOptional()
  primaryColor?: string;

  @IsHexColor()
  @IsOptional()
  secondaryColor?: string;

  @IsString()
  @IsOptional()
  fontFamily?: string;

  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @IsUrl()
  @IsOptional()
  backgroundImageUrl?: string;

  @IsString()
  @IsOptional()
  brandingText?: string;
}
