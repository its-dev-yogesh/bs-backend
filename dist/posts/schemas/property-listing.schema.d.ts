import { HydratedDocument } from 'mongoose';
export type PropertyListingDocument = HydratedDocument<PropertyListing>;
export declare enum PropertyType {
    FLAT = "flat",
    HOUSE = "house",
    VILLA = "villa",
    PLOT = "plot"
}
export declare enum ListingType {
    SALE = "sale",
    RENT = "rent"
}
export declare enum FurnishingType {
    FURNISHED = "furnished",
    SEMI = "semi",
    UNFURNISHED = "unfurnished"
}
export declare class PropertyListing {
    _id?: string;
    post_id: string;
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
    available_from?: Date;
    createdAt?: Date;
}
export declare const PropertyListingSchema: import("mongoose").Schema<PropertyListing, import("mongoose").Model<PropertyListing, any, any, any, any, any, PropertyListing>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    post_id?: import("mongoose").SchemaDefinitionProperty<string, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    property_type?: import("mongoose").SchemaDefinitionProperty<PropertyType, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    listing_type?: import("mongoose").SchemaDefinitionProperty<ListingType, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bhk?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bathrooms?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    balconies?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    area_sqft?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    floor_number?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    total_floors?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    furnishing?: import("mongoose").SchemaDefinitionProperty<FurnishingType | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    available_from?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PropertyListing, import("mongoose").Document<unknown, {}, PropertyListing, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyListing & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PropertyListing>;
