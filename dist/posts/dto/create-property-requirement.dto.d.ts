import { PropertyType } from '../schemas/property-listing.schema';
import { RequirementListingType } from '../schemas/property-requirement.schema';
export declare class CreatePropertyRequirementDto {
    budget_min?: number;
    budget_max?: number;
    property_type?: PropertyType;
    listing_type: RequirementListingType;
    bhk_min?: number;
    bhk_max?: number;
    preferred_location_text?: string;
    latitude?: number;
    longitude?: number;
    move_in_by?: string;
}
