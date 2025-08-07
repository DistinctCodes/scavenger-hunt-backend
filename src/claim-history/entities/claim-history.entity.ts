import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  import { IsUUID, IsEnum, IsOptional, IsString, MaxLength, IsDateString, IsNumber, Min } from 'class-validator';
  import { ClaimStatus } from '../enums/claim-status.enum';
  
  @Entity('claim_history')
  @Index(['playerId']) // Index for player's claims
  @Index(['rewardId']) // Index for reward claims
  @Index(['status']) // Index for status filtering
  @Index(['playerId', 'rewardId']) // Composite index for checking duplicates
  @Index(['claimedAt']) // Index for time-based queries
  export class ClaimHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('uuid')
    @IsUUID()
    playerId: string;
  
    @Column('uuid')
    @IsUUID()
    rewardId: string;
  
    @Column('varchar', { length: 255 })
    @IsString()
    @MaxLength(255)
    rewardName: string;
  
    @Column('varchar', { length: 100, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    rewardType?: string; // e.g., 'coins', 'badge', 'item', 'achievement'
  
    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    @IsOptional()
    @IsNumber()
    @Min(0)
    rewardValue?: number; // Numerical value for coins, points, etc.
  
    @Column({
      type: 'enum',
      enum: ClaimStatus,
      default: ClaimStatus.CLAIMED,
    })
    @IsEnum(ClaimStatus)
    status: ClaimStatus;
  
    @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
    @IsDateString()
    claimedAt: Date;
  
    @Column('varchar', { length: 255, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    source?: string; // e.g., 'daily_login', 'puzzle_completion', 'achievement'
  
    @Column('varchar', { length: 500, nullable: true })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;
  
    @Column('json', { nullable: true })
    metadata?: Record<string, any>; // Additional data like puzzle ID, level, etc.
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }