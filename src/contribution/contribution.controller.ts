import { Controller, Post, Get, Patch, Param, Body } from '@nestjs/common';
import { ContributionsService } from './contribution.service';
import { CreateContributionDto } from './dto/create-contribution.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly service: ContributionsService) {}

  @Post()
  submit(@Body() dto: CreateContributionDto) {
    return this.service.submit(dto);
  }

  @Get('pending')
  getPending() {
    return this.service.getPending();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }
}
