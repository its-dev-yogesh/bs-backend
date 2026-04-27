import { HydratedDocument } from 'mongoose';
export type SavedPostDocument = HydratedDocument<SavedPost>;
export declare class SavedPost {
    _id?: string;
    user_id: string;
    post_id: string;
    createdAt?: Date;
}
export declare const SavedPostSchema: import("mongoose").Schema<SavedPost, import("mongoose").Model<SavedPost, any, any, any, any, any, SavedPost>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user_id?: import("mongoose").SchemaDefinitionProperty<string, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    post_id?: import("mongoose").SchemaDefinitionProperty<string, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, SavedPost, import("mongoose").Document<unknown, {}, SavedPost, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SavedPost & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, SavedPost>;
