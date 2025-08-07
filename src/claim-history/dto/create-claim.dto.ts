import { 
    IsUUID, 
    IsString, 
    MaxLength, 
    IsOptional, 
    IsEnum, 
    IsNumber, 
    Min, 
    IsObject 
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { ClaimStatus } from '../enums/claim-status.enum';
  
  export class CreateClaimDto {
    @ApiProperty({
      description: 'The UUID of the reward being claimed',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsUUID()
    rewardId: string;
  
    @ApiProperty({
      description: 'Name of the reward',
      example: '100 Gold Coins',
      maxLength: 255,
    })
    @IsString()
    @MaxLength(255)
    rewardName: string;
  
    @ApiProperty({
      description: 'Type of reward',
      example: 'coins',
      maxLength: 100,
      required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    rewardType?: string;
  
    @ApiProperty({
      description: 'Numerical value of the reward',
      example: 100,
      minimum: 0,
      required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    rewardValue?: number;
  
    @ApiProperty({
      description: 'Status of the claim',
      enum: ClaimStatus,
      default: ClaimStatus.CLAIMED,
      required: false,
    })
    @IsOptional()
    @IsEnum(ClaimStatus)
    status?: ClaimStatus = ClaimStatus.CLAIMED;
  
    @ApiProperty({
      description: 'Source of the reward',
      example: 'daily_login',
      maxLength: 255,
      required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    source?: string;
  
    @ApiProperty({
      description: 'Additional notes about the claim',
      example: 'Claimed after completing puzzle #123',
      maxLength: 500,
      required: false,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    notes?: string;
  
    @ApiProperty({
      description: 'Additional metadata about the claim',
      example: { puzzleId: 'uuid', difficulty: 'hard', completionTime: 120 },
      required: false,
    })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
  }