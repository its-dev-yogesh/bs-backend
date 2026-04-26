import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { UserProfile } from './schemas/user-profile.schema';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile.name) private userProfileModel: Model<UserProfile>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(user_id: string, createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    // Check if profile already exists for this user
    const existingProfile = await this.userProfileModel.findOne({ user_id });
    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

    const createdProfile = new this.userProfileModel({
      user_id,
      ...createUserProfileDto,
    });
    const savedProfile = await createdProfile.save();

    // Clear cache
    await this.cacheManager.del(`user_profile_${user_id}`);

    return savedProfile;
  }

  async findByUserId(user_id: string): Promise<UserProfile | null> {
    const cacheKey = `user_profile_${user_id}`;

    // Try to get from cache
    const cachedProfile = await this.cacheManager.get<UserProfile>(cacheKey);
    if (cachedProfile) {
      console.log(`Returning profile for user ${user_id} from cache`);
      return cachedProfile;
    }

    console.log(`Fetching profile for user ${user_id} from database`);
    const profile = await this.userProfileModel.findOne({ user_id }).exec();

    if (profile) {
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, profile, 300000);
    }

    return profile;
  }

  async update(user_id: string, updateUserProfileDto: Partial<CreateUserProfileDto>): Promise<UserProfile | null> {
    const updatedProfile = await this.userProfileModel
      .findOneAndUpdate({ user_id }, updateUserProfileDto, { new: true })
      .exec();

    // Clear cache
    await this.cacheManager.del(`user_profile_${user_id}`);

    return updatedProfile;
  }

  async delete(user_id: string): Promise<void> {
    await this.userProfileModel.findOneAndDelete({ user_id }).exec();

    // Clear cache
    await this.cacheManager.del(`user_profile_${user_id}`);
  }

  async findAll(): Promise<UserProfile[]> {
    const cacheKey = 'all_user_profiles';

    // Try to get from cache
    const cachedProfiles = await this.cacheManager.get<UserProfile[]>(cacheKey);
    if (cachedProfiles) {
      console.log('Returning all profiles from cache');
      return cachedProfiles;
    }

    console.log('Fetching all profiles from database');
    const profiles = await this.userProfileModel.find().exec();

    // Store in cache for 5 minutes
    await this.cacheManager.set(cacheKey, profiles, 300000);

    return profiles;
  }
}
