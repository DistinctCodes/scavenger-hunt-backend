import { ApiProperty } from '@nestjs/swagger';

export class ClaimSummaryDto {
  @ApiProperty({
    description: 'Total number of claims',
    example: 150,
  })
  totalClaims: number;

  @ApiProperty({
    description: 'Total value of claimed rewards',
    example: 5000.50,
  })
  totalValue: number;

  @ApiProperty({
    description: 'Claims by status',
    example: {
      claimed: 140,
      pending: 5,
      failed: 3,
      expired: 2,
      cancelled: 0,
    },
  })
  claimsByStatus: Record<string, number>;

  @ApiProperty({
    description: 'Claims by reward type',
    example: {
      coins: 80,
      badges: 25,
      items: 30,
      achievements: 15,
    },
  })
  claimsByType: Record<string, number>;

  @ApiProperty({
    description: 'Claims by source',
    example: {
      daily_login: 60,
      puzzle_completion: 70,
      achievements: 20,
    },
  })
  claimsBySource: Record<string, number>;

  @ApiProperty({
    description: 'Recent claim dates and counts',
    example: {
      '2025-08-07': 15,
      '2025-08-06': 12,
      '2025-08-05': 8,
    },
  })
  recentActivity: Record<string, number>;
}