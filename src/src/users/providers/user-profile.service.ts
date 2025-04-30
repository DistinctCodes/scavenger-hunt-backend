import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile, ProfileVisibility } from '../user-profile.entity';
import { User } from '../users.entity';
import { CreateProfileDto } from '../dtos/create-profile.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private profileRepository: Repository<UserProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createProfile(userId: string, createProfileDto: CreateProfileDto): Promise<UserProfile> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const profile = this.profileRepository.create({
      user,
      ...createProfileDto,
    });

    return this.profileRepository.save(profile);
  }

  async getProfileById(profileId: string, currentUserId?: string): Promise<UserProfile> {
    const profile = await this.profileRepository.findOne({
      where: { id: profileId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (profile.user.id !== currentUserId) {
      if (profile.visibility === ProfileVisibility.PRIVATE) {
        throw new ForbiddenException('This profile is private');
      }
      
      if (profile.visibility === ProfileVisibility.FRIENDS_ONLY) {
        throw new ForbiddenException('This profile is only visible to friends');
      }
    }

    return profile;
  }

  async getProfileByUserId(userId: string, currentUserId?: string): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    console.log('Found user:', user);

    if (!user || !user.profile) {
      throw new NotFoundException('Profile not found');
    }

    const profile = await this.profileRepository.findOne({
      where: { id: user.profile.id },
      relations: ['user'],
    });

    if (user.id !== currentUserId) {
      if (profile.visibility === ProfileVisibility.PRIVATE) {
        throw new ForbiddenException('This profile is private');
      }
      
      if (profile.visibility === ProfileVisibility.FRIENDS_ONLY) {
        throw new ForbiddenException('This profile is only visible to friends');
      }
    }

    profile.lastActive = new Date();
    await this.profileRepository.save(profile);

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.profileRepository.update(user.profile.id, updateProfileDto);
    
    return this.profileRepository.findOne({
      where: { id: user.profile.id },
      relations: ['user'],
    });
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.profileRepository.update(user.profile.id, { avatarUrl });
    
    return this.profileRepository.findOne({
      where: { id: user.profile.id },
      relations: ['user'],
    });
  }

  async deleteProfile(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Profile not found');
    }

    await this.profileRepository.delete(user.profile.id);
  }
} 