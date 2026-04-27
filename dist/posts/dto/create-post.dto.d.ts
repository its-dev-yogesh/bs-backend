import { PostStatus, PostVisibility } from '../schemas/post.schema';
import { CreatePropertyListingDto } from './create-property-listing.dto';
import { CreatePropertyRequirementDto } from './create-property-requirement.dto';
export declare class BasePostFieldsDto {
    title: string;
    description?: string;
    location_text?: string;
    latitude?: number;
    longitude?: number;
    visibility?: PostVisibility;
    status?: PostStatus;
}
export declare class CreateListingPostDto extends BasePostFieldsDto {
    listing: CreatePropertyListingDto;
}
export declare class CreateRequirementPostDto extends BasePostFieldsDto {
    requirement: CreatePropertyRequirementDto;
}
export declare class UpdatePostDto {
    title?: string;
    description?: string;
    location_text?: string;
    latitude?: number;
    longitude?: number;
    visibility?: PostVisibility;
    status?: PostStatus;
}
