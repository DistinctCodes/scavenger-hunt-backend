import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly usersService: UsersService) {
    super({
      clientID: 'yweufybweuf3782-testing',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;

    // Extract required fields
    const email = emails?.[0]?.value || 'no-email';
    const firstName = name?.givenName || 'GoogleUser';
    const lastName = name?.familyName || '';

    const password = 'google-auth';
    // Create or find user in database
    const user = await this.usersService.findOrCreateGoogleUser({
      email,
      firstName,
      lastName,
      password,
    });
    done(null, user);
  }
}
