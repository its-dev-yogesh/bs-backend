import { UserType } from '../schemas/user.schema';
export declare class CreateUserDto {
    username: string;
    email: string;
    password: string;
    phone?: string;
    type?: UserType;
}
