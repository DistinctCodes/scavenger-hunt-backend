import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contribution } from './entities/contribution.entity';
import { ContributionsController } from './contribution.controller';
import { ContributionsService } from './contribution.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contribution])],
  controllers: [ContributionsController],
  providers: [ContributionsService],
})
export class ContributionsModule {}
