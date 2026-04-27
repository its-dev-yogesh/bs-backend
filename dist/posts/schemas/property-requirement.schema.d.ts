import { HydratedDocument } from 'mongoose';
import { PropertyType } from './property-listing.schema';
export type PropertyRequirementDocument = HydratedDocument<PropertyRequirement>;
export declare enum RequirementListingType {
    BUY = "buy",
    RENT = "rent"
}
export declare class PropertyRequirement {
    _id?: string;
    post_id: string;
    budget_min?: number;
    budget_max?: number;
    property_type?: PropertyType;
    listing_type: RequirementListingType;
    bhk_min?: number;
    bhk_max?: number;
    preferred_location_text?: string;
    latitude?: number;
    longitude?: number;
    move_in_by?: Date;
    createdAt?: Date;
}
export declare const PropertyRequirementSchema: import("mongoose").Schema<PropertyRequirement, import("mongoose").Model<PropertyRequirement, any, any, any, any, any, PropertyRequirement>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    post_id?: import("mongoose").SchemaDefinitionProperty<string, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    budget_min?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    budget_max?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    property_type?: import("mongoose").SchemaDefinitionProperty<PropertyType | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    listing_type?: import("mongoose").SchemaDefinitionProperty<RequirementListingType, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bhk_min?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bhk_max?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    preferred_location_text?: import("mongoose").SchemaDefinitionProperty<string | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    latitude?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    longitude?: import("mongoose").SchemaDefinitionProperty<number | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    move_in_by?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PropertyRequirement, import("mongoose").Document<unknown, {}, PropertyRequirement, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PropertyRequirement & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PropertyRequirement>;
