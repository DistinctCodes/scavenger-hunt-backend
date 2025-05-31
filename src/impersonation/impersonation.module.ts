import { forwardRef, Module } from '@nestjs/common';
import { ImpersonationService } from './impersonation.service';
import { ImpersonationController } from './impersonation.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => AuthModule),
    // JwtModule.register({})
  ],
  providers: [ImpersonationService],
  controllers: [ImpersonationController],
})
export class ImpersonationModule {}
