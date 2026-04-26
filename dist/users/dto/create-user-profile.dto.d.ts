import { Gender } from '../schemas/user-profile.schema';
export declare class CreateUserProfileDto {
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    website?: string;
    dob?: string;
    gender?: Gender;
    rerano?: string;
    location?: string;
}
