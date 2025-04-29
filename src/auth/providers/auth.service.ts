import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from '../dtos/signIn.dto';
import { TokenService } from './token.service';
import { UsersService } from '../../users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { CreateUserDto } from '../dtos/create-user.dto';
import {
  ForgotPasswordDto,
  RestPasswordDto,
} from '../dtos/forgot-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { Repository } from 'typeorm';
import { emailverification } from 'src/Email/verification';
import { generateUniqueKey } from './uniqueKey.provider';
@Injectable()
export class AuthService {
  constructor(
    private tokenService: TokenService,
    private usersService: UsersService,
    private hashingProvider: HashingProvider,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.userRepository.findOne({
      where: { email: signInDto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password using your existing HashingProvider
    const isPasswordValid = await this.hashingProvider.comparePassword(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles || [],
    };

    // Return tokens using the TokenService
    return this.tokenService.generateTokens(payload);
  }

  async signUp(createUserDto: CreateUserDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );

    // Create the user - map name to firstName
    const user = await this.usersService.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
    });

    // Generate tokens
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles || [],
    };

    return this.tokenService.generateTokens(payload);
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);

      // Check if user still exists
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      // Generate new tokens
      const newPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles || [],
      };

      return this.tokenService.generateTokens(newPayload);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  public async validateToken(token: string) {
    try {
      return this.tokenService.verifyAccessToken(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getProfile(user: any) {
    return user;
  }

  public async googleLogin(userData: any) {
    if (!userData) {
      throw new UnauthorizedException('No user data received from Google');
    }

    const { email, firstName, lastName } = userData;

    let user = await this.usersService.findByEmail(email);
    if (!user) {
      // Create a new user if they don’t exist
      user = await this.usersService.create({
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        password: '',
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles || [],
    };

    return this.tokenService.generateTokens(payload);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<any> {
    try {
      const email = dto.email;
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const resetCode = generateUniqueKey(6);
      user.resetPasswordCode = resetCode;
      user.tokenExpires = new Date(Date.now() + 15 * 60 * 1000);

      await this.userRepository.save(user);
      await emailverification({
        name: user.firstName || email.split('@')[0],
        email: user.email,
        code: resetCode,
        type: 'Reset Token',
      });

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Reset code sent to your email',
      };
    } catch (error) {
      console.error('Forgot Password Error:', error);
      throw error;
    }
  }

  async resetPassword(dto: RestPasswordDto): Promise<any> {
    try {
      if (!dto.token || dto.token == ' ') {
        throw new BadRequestException('A valid token is required');
      }
      const user = await this.userRepository.findOne({
        where: { resetPasswordCode: dto.token },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      if (user.tokenExpires && user.tokenExpires < new Date()) {
        throw new BadRequestException(
          'Reset token has expired. Please request a new one.',
        );
      }

      if (!dto.newpassword) {
        throw new BadRequestException('New password is required');
      }

      const isSameAsCurrent = await this.hashingProvider.comparePassword(
        dto.newpassword,
        user.password,
      );
      if (isSameAsCurrent) {
        throw new BadRequestException(
          'You cannot reset your password to the current one',
        );
      }

      user.password = await this.hashingProvider.hashPassword(dto.newpassword);
      user.resetPasswordCode = null;

      await this.userRepository.save(user);

      return {
        success: true,
        code: HttpStatus.OK,
        message: 'Password reset successful',
      };
    } catch (error) {
      throw error;
    }
  }
}
