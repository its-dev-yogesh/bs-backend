import { HydratedDocument } from 'mongoose';
export type PermissionDocument = HydratedDocument<Permission>;
export declare enum PermissionModule {
    POST = "post",
    COMMENT = "comment",
    USER = "user",
    CHAT = "chat"
}
export declare enum PermissionAction {
    CREATE = "create",
    READ = "read",
    UPDATE = "update",
    DELETE = "delete",
    MODERATE = "moderate"
}
export declare enum PermissionScope {
    OWN = "own",
    ANY = "any",
    ASSIGNED = "assigned"
}
export declare class Permission {
    id?: number;
    module: PermissionModule;
    action: PermissionAction;
    scope: PermissionScope;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const PermissionSchema: import("mongoose").Schema<Permission, import("mongoose").Model<Permission, any, any, any, any, any, Permission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Permission, import("mongoose").Document<unknown, {}, Permission, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    id?: import("mongoose").SchemaDefinitionProperty<number | undefined, Permission, import("mongoose").Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    module?: import("mongoose").SchemaDefinitionProperty<PermissionModule, Permission, import("mongoose").Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    action?: import("mongoose").SchemaDefinitionProperty<PermissionAction, Permission, import("mongoose").Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    scope?: import("mongoose").SchemaDefinitionProperty<PermissionScope, Permission, import("mongoose").Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Permission, import("mongoose").Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Permission, import("mongoose").Document<unknown, {}, Permission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Permission & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Permission>;
