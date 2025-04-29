import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileService } from './providers/user-profile.service';
import { CreateProfileDto } from './dtos/create-profile.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from './users.entity';
import { storageConfig } from '../common/config/storage.config';
import { ProfileResponseDto } from './dtos/profile-response.dto';
import { plainToClass } from 'class-transformer';
import { UsersService } from './providers/users.service';
import { CreateUserDto } from './users.dto';
import { UpdateUserDto } from './users.dto';
import { Delete } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getMyProfile(@CurrentUser() user: User) {
    const profile = await this.userProfileService.getProfileByUserId(user.id, user.id);
    return plainToClass(ProfileResponseDto, profile, { excludeExtraneousValues: true });
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  async updateMyProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const profile = await this.userProfileService.updateProfile(user.id, updateProfileDto);
    return plainToClass(ProfileResponseDto, profile, { excludeExtraneousValues: true });
  }

  @UseGuards(JwtAuthGuard)
  @Post('profile/avatar')
  @UseInterceptors(FileInterceptor('avatar', storageConfig))
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const avatarUrl = `${process.env.API_URL || 'http://localhost:3000'}/uploads/avatars/${file.filename}`;
    const profile = await this.userProfileService.updateAvatar(user.id, avatarUrl);
    return plainToClass(ProfileResponseDto, profile, { excludeExtraneousValues: true });
  }

  @Get('profile/:id')
  async getUserProfile(
    @Param('id') userId: string,
    @CurrentUser() currentUser?: User,
  ) {
    const profile = await this.userProfileService.getProfileByUserId(
      userId,
      currentUser?.id,
    );
    return plainToClass(ProfileResponseDto, profile, { excludeExtraneousValues: true });
  }

  @Get('profile/me')
  async getProfile(@Req() req) {
    // Temporary fallback userId for testing purposes (to be removed once AuthGuard is implemented)
    const userId = req.user?.id || 'b7f89c2d-3e7a-4d12-a4f5-8c6d7e9b1a23';

    return this.usersService.findById(userId);
  }

  @Put('profile/me')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    // Temporary fallback userId for testing purposes (to be removed once AuthGuard is implemented)
    const userId = req.user?.id || 'b7f89c2d-3e7a-4d12-a4f5-8c6d7e9b1a23';
    return this.usersService.update(userId, updateUserDto);
  }

  @Get('wallet/:walletAddress')
  async findByWalletAddress(@Param('walletAddress') address: string) {
    return this.usersService.findByWalletAddress(address);
  }

  @Post('wallet/:walletAddress')
  async createFromWallet(@Param('walletAddress') address: string) {
    return this.usersService.createFromWallet(address);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
  ) {
    return this.usersService.findAll(Number(page), Number(limit), search);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
