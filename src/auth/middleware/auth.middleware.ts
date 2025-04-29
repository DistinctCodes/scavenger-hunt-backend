import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../providers/auth.service'; 
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        const payload = await this.authService.validateToken(token);
        
        if (payload) {
          const user = await this.usersService.findById(payload.sub);
          
          if (user) {
            // Attach user to request
            const { password, ...result } = user;
            req['user'] = result;
          }
        }
      }
    } catch (error) {
      // Don't throw error here, just don't set the user
      // The guards will handle authentication requirements
    }
    
    next();
  }
}