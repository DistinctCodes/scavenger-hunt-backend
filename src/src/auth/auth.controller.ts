import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { Request } from 'express';
import { SignInDto } from './dtos/signIn.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { Public } from './guards/decorators/public.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { ForgotPasswordDto, RestPasswordDto } from './dtos/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(RateLimitGuard)
  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('sign-up')
  public signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Public()
  @Post('refresh')
  public refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get('me')
  async me(@Req() req: Request) {
    return this.authService.getProfile(req);
  }

  // for testing purposes to see whether the protected works
  @Get('protected')
  getProtectedData() {
    return { message: 'This is protected data!' };
  }

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req.user);
  }

  @UseGuards(RateLimitGuard)
  @Public()
  @Post('request/forgot-password')
  public async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset/password')
  public async restPassword(@Body() dto: RestPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
