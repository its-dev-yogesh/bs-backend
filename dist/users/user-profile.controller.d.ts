import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UserProfile } from './schemas/user-profile.schema';
export declare class UserProfileController {
    private readonly userProfileService;
    constructor(userProfileService: UserProfileService);
    create(userId: string, createUserProfileDto: CreateUserProfileDto): Promise<UserProfile>;
    findByUserId(userId: string): Promise<UserProfile | null>;
    update(userId: string, updateUserProfileDto: Partial<CreateUserProfileDto>): Promise<UserProfile | null>;
    delete(userId: string): Promise<void>;
}
