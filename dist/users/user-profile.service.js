"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_2 = require("mongoose");
const user_profile_schema_1 = require("./schemas/user-profile.schema");
let UserProfileService = class UserProfileService {
    userProfileModel;
    cacheManager;
    constructor(userProfileModel, cacheManager) {
        this.userProfileModel = userProfileModel;
        this.cacheManager = cacheManager;
    }
    async create(user_id, createUserProfileDto) {
        const existingProfile = await this.userProfileModel.findOne({ user_id });
        if (existingProfile) {
            throw new Error('Profile already exists for this user');
        }
        const createdProfile = new this.userProfileModel({
            user_id,
            ...createUserProfileDto,
        });
        const savedProfile = await createdProfile.save();
        await this.cacheManager.del(`user_profile_${user_id}`);
        return savedProfile;
    }
    async findByUserId(user_id) {
        const cacheKey = `user_profile_${user_id}`;
        const cachedProfile = await this.cacheManager.get(cacheKey);
        if (cachedProfile) {
            console.log(`Returning profile for user ${user_id} from cache`);
            return cachedProfile;
        }
        console.log(`Fetching profile for user ${user_id} from database`);
        const profile = await this.userProfileModel.findOne({ user_id }).exec();
        if (profile) {
            await this.cacheManager.set(cacheKey, profile, 300000);
        }
        return profile;
    }
    async update(user_id, updateUserProfileDto) {
        const updatedProfile = await this.userProfileModel
            .findOneAndUpdate({ user_id }, updateUserProfileDto, { new: true })
            .exec();
        await this.cacheManager.del(`user_profile_${user_id}`);
        return updatedProfile;
    }
    async delete(user_id) {
        await this.userProfileModel.findOneAndDelete({ user_id }).exec();
        await this.cacheManager.del(`user_profile_${user_id}`);
    }
    async findAll() {
        const cacheKey = 'all_user_profiles';
        const cachedProfiles = await this.cacheManager.get(cacheKey);
        if (cachedProfiles) {
            console.log('Returning all profiles from cache');
            return cachedProfiles;
        }
        console.log('Fetching all profiles from database');
        const profiles = await this.userProfileModel.find().exec();
        await this.cacheManager.set(cacheKey, profiles, 300000);
        return profiles;
    }
};
exports.UserProfileService = UserProfileService;
exports.UserProfileService = UserProfileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_profile_schema_1.UserProfile.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], UserProfileService);
//# sourceMappingURL=user-profile.service.js.map