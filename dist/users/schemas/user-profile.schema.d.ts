import { HydratedDocument } from 'mongoose';
export type UserProfileDocument = HydratedDocument<UserProfile>;
export declare enum Gender {
    MALE = "male",
    FEMALE = "female",
    OTHER = "other"
}
export declare class UserProfile {
    id?: string;
    _id?: string;
    user_id: string;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
    website?: string;
    dob?: Date;
    gender?: Gender;
    rerano?: string;
    location?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const UserProfileSchema: import("mongoose").Schema<UserProfile, import("mongoose").Model<UserProfile, any, any, any, any, any, UserProfile>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    id?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user_id?: import("mongoose").SchemaDefinitionProperty<string, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    full_name?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    bio?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    avatar_url?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    website?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    dob?: import("mongoose").SchemaDefinitionProperty<Date | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    gender?: import("mongoose").SchemaDefinitionProperty<Gender | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rerano?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<string | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, UserProfile, import("mongoose").Document<unknown, {}, UserProfile, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<UserProfile & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, UserProfile>;
