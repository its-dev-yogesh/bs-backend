import { HydratedDocument } from 'mongoose';
export type ReactionDocument = HydratedDocument<Reaction>;
export declare enum ReactionType {
    LIKE = "like",
    INTERESTED = "interested"
}
export declare class Reaction {
    _id?: string;
    user_id: string;
    post_id: string;
    type: ReactionType;
    createdAt?: Date;
}
export declare const ReactionSchema: import("mongoose").Schema<Reaction, import("mongoose").Model<Reaction, any, any, any, any, any, Reaction>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    user_id?: import("mongoose").SchemaDefinitionProperty<string, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    post_id?: import("mongoose").SchemaDefinitionProperty<string, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<ReactionType, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Reaction, import("mongoose").Document<unknown, {}, Reaction, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Reaction & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Reaction>;
