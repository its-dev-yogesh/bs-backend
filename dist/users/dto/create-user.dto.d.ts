import { UserType } from '../schemas/user.schema';
export declare class CreateUserDto {
    username: string;
    phone: string;
    email?: string;
    password: string;
    type?: UserType;
}
