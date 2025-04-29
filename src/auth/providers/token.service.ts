import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export interface TokenPayload {
    isRefreshToken?: boolean;
    sub: string;
    email: string;
    roles?: string[];
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(
      { ...payload, isRefreshToken: true },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
      },
    );
  }

  verifyAccessToken(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token);
  }

  verifyRefreshToken(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }

  generateTokens(payload: TokenPayload): TokenResponse {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpiration(),
    };
  }

  private getTokenExpiration(): number {
    const expiration = this.configService.get<string>('JWT_EXPIRATION', '15m');
    
    // Convert time format to seconds
    if (expiration.endsWith('m')) {
      return parseInt(expiration) * 60;
    } else if (expiration.endsWith('h')) {
      return parseInt(expiration) * 60 * 60;
    } else if (expiration.endsWith('d')) {
      return parseInt(expiration) * 60 * 60 * 24;
    }
    
    return parseInt(expiration);
  }
}