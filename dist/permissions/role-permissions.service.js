"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_2 = require("mongoose");
const role_permission_schema_1 = require("./schemas/role-permission.schema");
let RolePermissionsService = class RolePermissionsService {
    rolePermissionModel;
    cacheManager;
    constructor(rolePermissionModel, cacheManager) {
        this.rolePermissionModel = rolePermissionModel;
        this.cacheManager = cacheManager;
    }
    async create(createRolePermissionDto) {
        const existing = await this.rolePermissionModel.findOne({
            role_name: createRolePermissionDto.role_name,
            permission_id: createRolePermissionDto.permission_id,
        });
        if (existing) {
            throw new common_1.BadRequestException('This role-permission mapping already exists');
        }
        const createdRolePermission = new this.rolePermissionModel(createRolePermissionDto);
        const savedRolePermission = await createdRolePermission.save();
        await this.cacheManager.del(`role_permissions_${createRolePermissionDto.role_name}`);
        return savedRolePermission;
    }
    async findByRole(role_name) {
        const cacheKey = `role_permissions_${role_name}`;
        const cachedRolePermissions = await this.cacheManager.get(cacheKey);
        if (cachedRolePermissions) {
            console.log(`Returning permissions for role ${role_name} from cache`);
            return cachedRolePermissions;
        }
        console.log(`Fetching permissions for role ${role_name} from database`);
        const rolePermissions = await this.rolePermissionModel
            .find({ role_name })
            .exec();
        if (rolePermissions.length > 0) {
            await this.cacheManager.set(cacheKey, rolePermissions, 300000);
        }
        return rolePermissions;
    }
    async findAll() {
        const cacheKey = 'all_role_permissions';
        const cachedRolePermissions = await this.cacheManager.get(cacheKey);
        if (cachedRolePermissions) {
            console.log('Returning all role permissions from cache');
            return cachedRolePermissions;
        }
        console.log('Fetching all role permissions from database');
        const rolePermissions = await this.rolePermissionModel.find().exec();
        await this.cacheManager.set(cacheKey, rolePermissions, 300000);
        return rolePermissions;
    }
    async findByPermissionId(permission_id) {
        const cacheKey = `role_permissions_perm_${permission_id}`;
        const cachedRolePermissions = await this.cacheManager.get(cacheKey);
        if (cachedRolePermissions) {
            console.log(`Returning role permissions for permission ${permission_id} from cache`);
            return cachedRolePermissions;
        }
        console.log(`Fetching role permissions for permission ${permission_id} from database`);
        const rolePermissions = await this.rolePermissionModel
            .find({ permission_id })
            .exec();
        if (rolePermissions.length > 0) {
            await this.cacheManager.set(cacheKey, rolePermissions, 300000);
        }
        return rolePermissions;
    }
    async remove(role_name, permission_id) {
        await this.rolePermissionModel
            .findOneAndDelete({ role_name, permission_id })
            .exec();
        await this.cacheManager.del(`role_permissions_${role_name}`);
        await this.cacheManager.del(`role_permissions_perm_${permission_id}`);
        await this.cacheManager.del('all_role_permissions');
    }
    async removeByRole(role_name) {
        await this.rolePermissionModel.deleteMany({ role_name }).exec();
        await this.cacheManager.del(`role_permissions_${role_name}`);
        await this.cacheManager.del('all_role_permissions');
    }
    async removeByPermissionId(permission_id) {
        await this.rolePermissionModel.deleteMany({ permission_id }).exec();
        await this.cacheManager.del(`role_permissions_perm_${permission_id}`);
        await this.cacheManager.del('all_role_permissions');
    }
};
exports.RolePermissionsService = RolePermissionsService;
exports.RolePermissionsService = RolePermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(role_permission_schema_1.RolePermission.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], RolePermissionsService);
//# sourceMappingURL=role-permissions.service.js.map