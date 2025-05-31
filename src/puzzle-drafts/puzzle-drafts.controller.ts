import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PuzzleDraftService } from './puzzle-drafts.service';
import { CreatePuzzleDto } from 'src/puzzle/dto/create-puzzle.dto';
import { UpdatePuzzleDto } from 'src/puzzle/dto/update-puzzle.dto';

@Controller('puzzle-drafts')
@UseGuards(AuthGuard)
export class PuzzleDraftController {
  constructor(private readonly puzzleService: PuzzleDraftService) {}

  @Post()
  create(@Body() dto: CreatePuzzleDto, @Req() req) {
    return this.puzzleService.createDraft(dto, req.user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdatePuzzleDto, @Req() req) {
    return this.puzzleService.updateDraft(id, dto, req.user);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @Req() req) {
    return this.puzzleService.deleteDraft(id, req.user);
  }

  @Post(':id/publish')
  publish(@Param('id') id: number, @Req() req) {
    return this.puzzleService.publishDraft(id, req.user);
  }

  @Get()
  getMyDrafts(@Req() req) {
    return this.puzzleService.getMyDrafts(req.user);
  }
}

