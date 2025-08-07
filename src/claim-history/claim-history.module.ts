import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClaimHistoryService } from './claim-history.service';
import { ClaimHistoryController } from './claim-history.controller';
import { ClaimHistory } from './entities/claim-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClaimHistory])],
  controllers: [ClaimHistoryController],
  providers: [ClaimHistoryService],
  exports: [ClaimHistoryService], // Export service for use in other modules
})
export class ClaimHistoryModule {}