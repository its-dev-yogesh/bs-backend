import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HydratedDocument, Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { phone: createUserDto.phone },
        { username: createUserDto.username },
        ...(createUserDto.email ? [{ email: createUserDto.email }] : []),
      ],
    });

    if (existingUser) {
      throw new BadRequestException(
        'User with this phone, username, or email already exists',
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(createUserDto.password, 10);

    const createdUser = new this.userModel({
      username: createUserDto.username,
      phone: createUserDto.phone,
      email: createUserDto.email,
      type: createUserDto.type,
      password_hash,
    });
    const savedUser = await createdUser.save();

    // Clear cache after creating a user
    await this.cacheManager.del('all_users');

    return this.sanitizeUser(savedUser);
  }

  async findAll(): Promise<User[]> {
    const cacheKey = 'all_users';

    // Try to get from cache
    const cachedUsers = await this.cacheManager.get<User[]>(cacheKey);
    if (cachedUsers) {
      console.log('Returning users from cache');
      return cachedUsers;
    }

    console.log('Fetching users from database');
    const users = await this.userModel.find().exec();

    // Store in cache for 5 minutes (300000ms)
    await this.cacheManager.set(cacheKey, users, 300000);

    return users.map((user) => this.sanitizeUser(user));
  }

  async findById(id: string): Promise<User | null> {
    const cacheKey = `user_${id}`;

    // Try to get from cache
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      console.log(`Returning user ${id} from cache`);
      return cachedUser;
    }

    console.log(`Fetching user ${id} from database`);
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (user) {
      const sanitized = this.sanitizeUser(user);
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, sanitized, 300000);
      return sanitized;
    }

    return null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const cacheKey = `user_username_${username}`;

    // Try to get from cache
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      console.log(`Returning user with username ${username} from cache`);
      return cachedUser;
    }

    console.log(`Fetching user with username ${username} from database`);
    const user = await this.userModel.findOne({ username }).exec();

    if (user) {
      const sanitized = this.sanitizeUser(user);
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, sanitized, 300000);
      return sanitized;
    }

    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const cacheKey = `user_email_${email}`;

    // Try to get from cache
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      console.log(`Returning user with email ${email} from cache`);
      return cachedUser;
    }

    console.log(`Fetching user with email ${email} from database`);
    const user = await this.userModel.findOne({ email }).exec();

    if (user) {
      const sanitized = this.sanitizeUser(user);
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, sanitized, 300000);
      return sanitized;
    }

    return null;
  }

  async findByPhone(phone: string): Promise<User | null> {
    const cacheKey = `user_phone_${phone}`;

    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    const user = await this.userModel.findOne({ phone }).exec();
    if (user) {
      const sanitized = this.sanitizeUser(user);
      await this.cacheManager.set(cacheKey, sanitized, 300000);
      return sanitized;
    }
    return null;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User | null> {
    const { password, ...updatePayload } = updateUserDto;

    // Hash password if provided
    if (password) {
      updatePayload['password_hash'] = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updatePayload, { new: true })
      .exec();

    // Clear related caches
    await this.cacheManager.del(`user_${id}`);
    if (updateUserDto.email) {
      await this.cacheManager.del(`user_email_${updateUserDto.email}`);
    }
    if (updateUserDto.phone) {
      await this.cacheManager.del(`user_phone_${updateUserDto.phone}`);
    }
    if (updateUserDto.username) {
      await this.cacheManager.del(`user_username_${updateUserDto.username}`);
    }
    await this.cacheManager.del('all_users');

    return updatedUser ? this.sanitizeUser(updatedUser) : null;
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();

    // Clear related caches
    await this.cacheManager.del(`user_${id}`);
    await this.cacheManager.del('all_users');
  }

  verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }

  private sanitizeUser(user: HydratedDocument<User> | User): User {
    const plain: Partial<User> =
      'toObject' in user && typeof user.toObject === 'function'
        ? user.toObject()
        : { ...user };
    delete plain.password_hash;
    return plain as User;
  }
}
