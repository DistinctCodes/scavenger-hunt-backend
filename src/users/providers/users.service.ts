import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../users.dto';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
 
import { Inject, forwardRef } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => UserProfileService))
    private userProfileService: UserProfileService,
  ) {}

  //GET ALL USERS
  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ users: UserResponseDto[]; total: number; message: string }> {
    const query = this.usersRepository.createQueryBuilder('user');

    if (search) {
      query.where(
        'user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    const [users, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      message: total > 0 ? 'Users retrieved successfully!' : 'No users found',
      total,
      users: users.map((user) =>
        plainToInstance(UserResponseDto, user, {
          excludeExtraneousValues: true,
        }),
      ),
    };
  }

  async create(userData: CreateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: userData.email },
    });
    if (existingUser)
      throw new BadRequestException('A user with this email already exists');

    const newUser = this.usersRepository.create(userData);
    const savedUser = await this.usersRepository.save(newUser);

    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  //GET USER BY ID
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  //GET USER BY EMAIL
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('No user found with this email');

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  //UPDATE USER DATA
  async update(id: string, userData: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.findById(id);

    Object.assign(user, userData);

    const savedUser = await this.usersRepository.save(user);
    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  //DELETE A PARTICULAR USER
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.softRemove(user);
  }

  //UPDATE LASTLY LOGGED IN TIME
  async updateLastLogin(id: string): Promise<void> {
    await this.findById(id); //contains error handling

    await this.usersRepository.update(id, { loggedInAt: new Date() });
  }

  //FIND BY WALLET ADDRESS
  async findByWalletAddress(address: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { walletAddress: address },
    });
    if (!user) throw new NotFoundException('User not found');

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  //CREATE USER FROM WALLET
  async createFromWallet(address: string): Promise<UserResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { walletAddress: address },
    });
    if (existingUser) return existingUser; //prefare returning user instead of error

    //This would need firstname, lastname, email, password since nullable is false for all of them.
    //So currently this would return an error, I'll get your thoughts after the first PR review and fix
    const newUser = this.usersRepository.create({ walletAddress: address });

    const savedUser = await this.usersRepository.save(newUser);
    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  //Another approach but would take this off or allow based on your thoughts.
  /*
  async createFromWallet(userData: CreateUserFromWalletDto): Promise<UserResponseDto> {
    const existingUser = await this.findByWalletAddress(userData.walletAddress);
    if (existingUser)
      throw new BadRequestException('Wallet already linked to a user');

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = this.userRepository.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      walletAddress: userData.walletAddress,
    });

    return this.userRepository.save(newUser);
  }
   */



  async findOrCreateGoogleUser({ email, firstName, lastName, password }) {
    let user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      user = this.usersRepository.create({
        email,
        firstName,
        lastName,
        password,
        walletAddress: null, 
        loggedInAt: new Date(), 
      });

      await this.usersRepository.save(user);
    }

    return user;
  }
}


