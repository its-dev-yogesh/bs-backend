import { PermissionModule, PermissionAction, PermissionScope } from '../schemas/permission.schema';
export declare class CreatePermissionDto {
    module: PermissionModule;
    action: PermissionAction;
    scope: PermissionScope;
}
