import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermission, RoleType } from './schemas/role-permission.schema';
export declare class RolePermissionsController {
    private readonly rolePermissionsService;
    constructor(rolePermissionsService: RolePermissionsService);
    create(createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission>;
    findAll(): Promise<RolePermission[]>;
    findByRole(role_name: RoleType): Promise<RolePermission[]>;
    findByPermissionId(permission_id: number): Promise<RolePermission[]>;
    remove(role_name: RoleType, permission_id: number): Promise<void>;
    removeByRole(role_name: RoleType): Promise<void>;
    removeByPermissionId(permission_id: number): Promise<void>;
}
