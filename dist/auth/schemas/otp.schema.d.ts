import { HydratedDocument } from 'mongoose';
export type OtpDocument = HydratedDocument<Otp>;
export declare enum OtpType {
    LOGIN = "login",
    REGISTRATION = "registration",
    PASSWORD_RESET = "password_reset",
    EMAIL_VERIFICATION = "email_verification"
}
export declare enum OtpStatus {
    PENDING = "pending",
    VERIFIED = "verified",
    EXPIRED = "expired",
    USED = "used"
}
export declare class Otp {
    _id?: string;
    phone: string;
    otp_code: string;
    type: OtpType;
    status: OtpStatus;
    expires_at: Date;
    attempts: number;
    max_attempts: number;
    metadata?: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
export declare const OtpSchema: import("mongoose").Schema<Otp, import("mongoose").Model<Otp, any, any, any, any, any, Otp>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Otp, import("mongoose").Document<unknown, {}, Otp, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
    _id: string;
}> & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    _id?: import("mongoose").SchemaDefinitionProperty<string | undefined, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    phone?: import("mongoose").SchemaDefinitionProperty<string, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    otp_code?: import("mongoose").SchemaDefinitionProperty<string, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<OtpType, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<OtpStatus, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expires_at?: import("mongoose").SchemaDefinitionProperty<Date, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    attempts?: import("mongoose").SchemaDefinitionProperty<number, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    max_attempts?: import("mongoose").SchemaDefinitionProperty<number, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    metadata?: import("mongoose").SchemaDefinitionProperty<Record<string, any> | undefined, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: import("mongoose").SchemaDefinitionProperty<Date | undefined, Otp, import("mongoose").Document<unknown, {}, Otp, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Otp & Required<{
        _id: string;
    }> & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Otp>;
