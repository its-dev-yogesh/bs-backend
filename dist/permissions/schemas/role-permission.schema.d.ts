import { HydratedDocument } from 'mongoose';
export type RolePermissionDocument = HydratedDocument<RolePermission>;
export declare enum RoleType {
    USER = "user",
    AGENT = "agent"
}
export declare class RolePermission {
    _id?: string;
    role_name: RoleType;
    permission_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const RolePermissionSchema: import("mongoose").Schema<RolePermission, import("mongoose").Model<RolePermission, any, any, any, any, any, RolePermission>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RolePermission, import("mongoose").Document<unknown, {}, RolePermission, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<RolePermission & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, RolePermission, import("mongoose").Document<unknown, {}, RolePermission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RolePermission & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role_name?: import("mongoose").SchemaDefinitionProperty<RoleType, RolePermission, import("mongoose").Document<unknown, {}, RolePermission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RolePermission & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    permission_id?: import("mongoose").SchemaDefinitionProperty<number, RolePermission, import("mongoose").Document<unknown, {}, RolePermission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RolePermission & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, RolePermission, import("mongoose").Document<unknown, {}, RolePermission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RolePermission & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, RolePermission, import("mongoose").Document<unknown, {}, RolePermission, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RolePermission & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, RolePermission>;
