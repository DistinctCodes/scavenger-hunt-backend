import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users.controller';
import { User } from './users.entity';
import { UserProfile } from './user-profile.entity';
import { UserProfileService } from './providers/user-profile.service';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './providers/users.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, UserProfile]),
    MulterModule.register({
      dest: './uploads',
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserProfileService],
  exports: [UsersService],
})
export class UsersModule {}
