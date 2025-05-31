// impersonation.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GenerateImpersonationTokenDto } from './dto/generate-impersonation-token.dto';
import { ImpersonationGuard } from 'src/common/guards/impersonation.guard';
import { Role } from 'src/common/enums/roles.enum';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('impersonation')
@UseGuards(JwtAuthGuard)
export class ImpersonationController {
  constructor(private readonly impersonationService: ImpersonationService) {}

  @Post('token')
  // The following guard is commented out because it has not been implemented yet.
  @UseGuards(ImpersonationGuard)
  @Roles(Role.ADMIN)
  async getImpersonationToken(
    @Req() req,
    @Body('userId')
    generateImpersonationTokenDto: GenerateImpersonationTokenDto,
  ) {
    const adminId = req.user.id;
    const token = await this.impersonationService.generateImpersonationToken(
      generateImpersonationTokenDto,
    );
    return { token };
  }

  @Post('revert')
  // The following guard is commented out because it has not been implemented yet.
  @UseGuards(ImpersonationGuard)
  async revert(@Req() req) {
    const realUserId = req.user.realUserId;
    if (!realUserId) throw new ForbiddenException('Not impersonating anyone');

    const token =
      await this.impersonationService.generateRevertToken(realUserId);
    return { token };
  }
}
