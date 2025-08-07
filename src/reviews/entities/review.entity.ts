import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  import { IsInt, Min, Max, IsString, MaxLength, IsUUID } from 'class-validator';
  
  @Entity('reviews')
  @Index(['challengeId']) // Index for better query performance
  @Index(['userId']) // Index for user's reviews
  @Index(['challengeId', 'userId'], { unique: true }) // Prevent duplicate reviews
  export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('uuid')
    @IsUUID()
    challengeId: string;
  
    @Column('uuid')
    @IsUUID()
    userId: string;
  
    @Column('int')
    @IsInt()
    @Min(1)
    @Max(5)
    stars: number;
  
    @Column('text', { nullable: true })
    @IsString()
    @MaxLength(1000)
    comment?: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }