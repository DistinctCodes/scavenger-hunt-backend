import { IsEnum, IsObject, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProfileVisibility } from '../user-profile.entity';

class SocialLinksDto {
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}

class PreferencesDto {
  @IsOptional()
  emailNotifications?: boolean;

  @IsOptional()
  darkMode?: boolean;

  @IsOptional()
  @IsString()
  language?: string;
}

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => SocialLinksDto)
  socialLinks?: SocialLinksDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PreferencesDto)
  preferences?: PreferencesDto;

  @IsOptional()
  @IsEnum(ProfileVisibility)
  visibility?: ProfileVisibility;
} 