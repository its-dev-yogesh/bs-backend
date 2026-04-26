import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { UserProfile } from './schemas/user-profile.schema';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
export declare class UserProfileService {
    private userProfileModel;
    private cacheManager;
    constructor(userProfileModel: Model<UserProfile>, cacheManager: Cache);
    create(user_id: string, createUserProfileDto: CreateUserProfileDto): Promise<UserProfile>;
    findByUserId(user_id: string): Promise<UserProfile | null>;
    update(user_id: string, updateUserProfileDto: Partial<CreateUserProfileDto>): Promise<UserProfile | null>;
    delete(user_id: string): Promise<void>;
    findAll(): Promise<UserProfile[]>;
}
