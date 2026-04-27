import { HydratedDocument } from 'mongoose';
export type PostMediaDocument = HydratedDocument<PostMedia>;
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video"
}
export declare class PostMedia {
    _id?: string;
    post_id: string;
    url: string;
    type: MediaType;
    order_index: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const PostMediaSchema: import("mongoose").Schema<PostMedia, import("mongoose").Model<PostMedia, any, any, any, any, any, PostMedia>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    post_id?: import("mongoose").SchemaDefinitionProperty<string, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    url?: import("mongoose").SchemaDefinitionProperty<string, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<MediaType, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    order_index?: import("mongoose").SchemaDefinitionProperty<number, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, PostMedia, import("mongoose").Document<unknown, {}, PostMedia, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PostMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PostMedia>;
