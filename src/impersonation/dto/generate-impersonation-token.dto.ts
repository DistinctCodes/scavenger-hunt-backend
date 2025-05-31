import { IsNumber } from 'class-validator';

export class GenerateImpersonationTokenDto {
  @IsNumber()
  targetUserId: string;

  @IsNumber()
  adminUserId: string;
}
