import { FurnishingType, ListingType, PropertyType } from '../schemas/property-listing.schema';
export declare class CreatePropertyListingDto {
    price: number;
    property_type: PropertyType;
    listing_type: ListingType;
    bhk?: number;
    bathrooms?: number;
    balconies?: number;
    area_sqft?: number;
    floor_number?: number;
    total_floors?: number;
    furnishing?: FurnishingType;
    available_from?: string;
}
export declare class UpsertPropertyListingDto extends CreatePropertyListingDto {
    post_id: string;
}
