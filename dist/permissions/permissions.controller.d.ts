import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './schemas/permission.schema';
export declare class PermissionsController {
    private readonly permissionsService;
    constructor(permissionsService: PermissionsService);
    create(createPermissionDto: CreatePermissionDto): Promise<Permission>;
    findAll(): Promise<Permission[]>;
    findById(id: number): Promise<Permission | null>;
    findByModuleAndAction(module: string, action: string): Promise<Permission[]>;
    update(id: number, updatePermissionDto: Partial<CreatePermissionDto>): Promise<Permission | null>;
    remove(id: number): Promise<void>;
}
