import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { Permission } from './schemas/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionsService {
    private permissionModel;
    private cacheManager;
    constructor(permissionModel: Model<Permission>, cacheManager: Cache);
    create(createPermissionDto: CreatePermissionDto): Promise<Permission>;
    findAll(): Promise<Permission[]>;
    findById(id: number): Promise<Permission | null>;
    findByModuleAndAction(module: string, action: string): Promise<Permission[]>;
    update(id: number, updatePermissionDto: Partial<CreatePermissionDto>): Promise<Permission | null>;
    remove(id: number): Promise<void>;
}
