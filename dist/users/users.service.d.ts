import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    private cacheManager;
    constructor(userModel: Model<User>, cacheManager: Cache);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
    update(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User | null>;
    remove(id: string): Promise<void>;
    verifyPassword(password: string, passwordHash: string): Promise<boolean>;
    private sanitizeUser;
}
