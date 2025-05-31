import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/providers/users.service';
import { GenerateImpersonationTokenDto } from './dto/generate-impersonation-token.dto';

@Injectable()
export class ImpersonationService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async generateImpersonationToken(
    generateImpersonationToken: GenerateImpersonationTokenDto,
  ): Promise<string> {
    const admin = await this.userService.findById(
      generateImpersonationToken.adminUserId,
    );
    // if (admin.role !== 'admin') {
    //   throw new ForbiddenException('Only admins can impersonate');
    // }

    const targetUser = await this.userService.findById(
      generateImpersonationToken.targetUserId,
    );
    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    return this.jwtService.sign(
      {
        sub: targetUser.id,
        impersonated: true,
        realUserId: admin.id,
      },
      { expiresIn: '10m' },
    );
  }

  async generateRevertToken(realUserId: number): Promise<string> {
    return this.jwtService.sign({ sub: realUserId }, { expiresIn: '1h' });
  }
}
