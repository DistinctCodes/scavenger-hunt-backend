import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './users.entity';

export enum ProfileVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIENDS_ONLY = 'friends_only',
}

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };

  @Column({ type: 'jsonb', nullable: true, default: {} })
  preferences: {
    emailNotifications?: boolean;
    darkMode?: boolean;
    language?: string;
  };

  @Column({
    type: 'enum',
    enum: ProfileVisibility,
    default: ProfileVisibility.PUBLIC,
  })
  visibility: ProfileVisibility;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastActive: Date;
} 