import { 
    IsOptional, 
    IsUUID, 
    IsEnum, 
    IsString, 
    IsDateString, 
    IsInt, 
    Min, 
    Max 
  } from 'class-validator';
  import { Transform } from 'class-transformer';
  import { ApiPropertyOptional } from '@nestjs/swagger';
  import { ClaimStatus } from '../enums/claim-status.enum';
  
  export class QueryClaimDto {
    @ApiPropertyOptional({
      description: 'Filter by player ID',
      example: '123e4567-e89b-12d3-a456-426614174001',
    })
    @IsOptional()
    @IsUUID()
    playerId?: string;
  
    @ApiPropertyOptional({
      description: 'Filter by reward ID',
      example: '123e4567-e89b-12d3-a456-426614174000',
    })
    @IsOptional()
    @IsUUID()
    rewardId?: string;
  
    @ApiPropertyOptional({
      description: 'Filter by reward type',
      example: 'coins',
    })
    @IsOptional()
    @IsString()
    rewardType?: string;
  
    @ApiPropertyOptional({
      description: 'Filter by claim status',
      enum: ClaimStatus,
      example: ClaimStatus.CLAIMED,
    })
    @IsOptional()
    @IsEnum(ClaimStatus)
    status?: ClaimStatus;
  
    @ApiPropertyOptional({
      description: 'Filter by reward source',
      example: 'daily_login',
    })
    @IsOptional()
    @IsString()
    source?: string;
  
    @ApiPropertyOptional({
      description: 'Filter claims from this date (ISO string)',
      example: '2025-01-01T00:00:00.000Z',
    })
    @IsOptional()
    @IsDateString()
    fromDate?: string;
  
    @ApiPropertyOptional({
      description: 'Filter claims to this date (ISO string)',
      example: '2025-12-31T23:59:59.999Z',
    })
    @IsOptional()
    @IsDateString()
    toDate?: string;
  
    @ApiPropertyOptional({
      description: 'Page number for pagination',
      minimum: 1,
      default: 1,
      example: 1,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    page?: number = 1;
  
    @ApiPropertyOptional({
      description: 'Number of items per page',
      minimum: 1,
      maximum: 100,
      default: 10,
      example: 10,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
  
    @ApiPropertyOptional({
      description: 'Sort order (newest, oldest, value_desc, value_asc)',
      enum: ['newest', 'oldest', 'value_desc', 'value_asc'],
      default: 'newest',
      example: 'newest',
    })
    @IsOptional()
    @IsString()
    sort?: 'newest' | 'oldest' | 'value_desc' | 'value_asc' = 'newest';
  }