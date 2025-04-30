import { CanActivate, ExecutionContext, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import rateLimit from 'express-rate-limit';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    handler: () => {
      throw new HttpException('Too many login attempts. Please try again later.', HttpStatus.TOO_MANY_REQUESTS);
    },
  });

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    this.limiter(req, res, () => {});
    return true;
  }
}
