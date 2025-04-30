import { Exclude, Expose, Type } from 'class-transformer';
import { ProfileVisibility } from '../user-profile.entity';

class UserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}

export class ProfileResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  bio: string;

  @Expose()
  avatarUrl: string;

  @Expose()
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };

  @Expose()
  preferences: {
    emailNotifications?: boolean;
    darkMode?: boolean;
    language?: string;
  };

  @Expose()
  visibility: ProfileVisibility;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  lastActive: Date;
} 