import { Module } from '@nestjs/common';
import { PuzzleDraftController } from './puzzle-drafts.controller';
import { PuzzleDraftService } from './puzzle-drafts.service';

@Module({
  controllers: [PuzzleDraftController],
  providers: [PuzzleDraftService]
})
export class PuzzleDraftsModule {}
