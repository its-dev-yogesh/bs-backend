import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { RolePermission, RoleType } from './schemas/role-permission.schema';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
export declare class RolePermissionsService {
    private rolePermissionModel;
    private cacheManager;
    constructor(rolePermissionModel: Model<RolePermission>, cacheManager: Cache);
    create(createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission>;
    findByRole(role_name: RoleType): Promise<RolePermission[]>;
    findAll(): Promise<RolePermission[]>;
    findByPermissionId(permission_id: number): Promise<RolePermission[]>;
    remove(role_name: RoleType, permission_id: number): Promise<void>;
    removeByRole(role_name: RoleType): Promise<void>;
    removeByPermissionId(permission_id: number): Promise<void>;
}
