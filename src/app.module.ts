import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProgressModule } from './progress/progress.module';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: Number.parseInt(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get('DATABASE_SYNC') === 'true',
        autoLoadEntities: configService.get('DATABASE_AUTOLOAD') === 'true',
        extra: {
          client_encoding: 'utf8',
        },
      }),
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    ProgressModule,
    DailyChallengeModule,
    ContributionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
import { PuzzlesResolver } from './puzzles/puzzles.resolver';
import { PuzzlesModule } from './puzzles/puzzles.module';
import { PuzzleModule } from './puzzle/puzzle.module';
import { RewardModule } from './reward/reward.module';
import { ConsentModule } from './consent/consent.module';
import { DraftReviewModule } from './draft-review/draft-review.module';
import { ErrorReportModule } from './error-report/error-report.module';
import { DailyChallengeModule } from './daily-challenge/daily-challenge.module';
import { ContributionModule } from './contribution/contribution.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: Number.parseInt(configService.get('DATABASE_PORT')),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        synchronize: configService.get('DATABASE_SYNC') === 'true',
        autoLoadEntities: configService.get('DATABASE_AUTOLOAD') === 'true',
        extra: {
          client_encoding: 'utf8',
        },
      }),
    }),
    AuthModule,
    UserModule,
    ProgressModule,
    PuzzlesModule,
    PuzzleModule,
    RewardModule,
    ConsentModule,
    DraftReviewModule,
    ErrorReportModule,
  ],
  controllers: [AppController],
  providers: [AppService, PuzzlesResolver],
})
export class AppModule {}
