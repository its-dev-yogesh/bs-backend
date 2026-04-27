import { HydratedDocument } from 'mongoose';
export type FeedDocument = HydratedDocument<Feed>;
export declare class Feed {
    _id?: string;
    user_id: string;
    post_id: string;
    score: number;
    createdAt?: Date;
}
export declare const FeedSchema: import("mongoose").Schema<Feed, import("mongoose").Model<Feed, any, any, any, any, any, Feed>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Feed, import("mongoose").Document<unknown, {}, Feed, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Feed & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, Feed, import("mongoose").Document<unknown, {}, Feed, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Feed & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user_id?: import("mongoose").SchemaDefinitionProperty<string, Feed, import("mongoose").Document<unknown, {}, Feed, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Feed & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    post_id?: import("mongoose").SchemaDefinitionProperty<string, Feed, import("mongoose").Document<unknown, {}, Feed, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Feed & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    score?: import("mongoose").SchemaDefinitionProperty<number, Feed, import("mongoose").Document<unknown, {}, Feed, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Feed & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Feed, import("mongoose").Document<unknown, {}, Feed, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Feed & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Feed>;
