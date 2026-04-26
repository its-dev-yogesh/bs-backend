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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_2 = require("mongoose");
const permission_schema_1 = require("./schemas/permission.schema");
let PermissionsService = class PermissionsService {
    permissionModel;
    cacheManager;
    constructor(permissionModel, cacheManager) {
        this.permissionModel = permissionModel;
        this.cacheManager = cacheManager;
    }
    async create(createPermissionDto) {
        const existingPermission = await this.permissionModel.findOne({
            module: createPermissionDto.module,
            action: createPermissionDto.action,
            scope: createPermissionDto.scope,
        });
        if (existingPermission) {
            throw new common_1.BadRequestException('This permission already exists');
        }
        const createdPermission = new this.permissionModel(createPermissionDto);
        const savedPermission = await createdPermission.save();
        await this.cacheManager.del('all_permissions');
        return savedPermission;
    }
    async findAll() {
        const cacheKey = 'all_permissions';
        const cachedPermissions = await this.cacheManager.get(cacheKey);
        if (cachedPermissions) {
            console.log('Returning permissions from cache');
            return cachedPermissions;
        }
        console.log('Fetching permissions from database');
        const permissions = await this.permissionModel.find().exec();
        await this.cacheManager.set(cacheKey, permissions, 300000);
        return permissions;
    }
    async findById(id) {
        const cacheKey = `permission_${id}`;
        const cachedPermission = await this.cacheManager.get(cacheKey);
        if (cachedPermission) {
            console.log(`Returning permission ${id} from cache`);
            return cachedPermission;
        }
        console.log(`Fetching permission ${id} from database`);
        const permission = await this.permissionModel.findOne({ id }).exec();
        if (permission) {
            await this.cacheManager.set(cacheKey, permission, 300000);
        }
        return permission;
    }
    async findByModuleAndAction(module, action) {
        const cacheKey = `permissions_${module}_${action}`;
        const cachedPermissions = await this.cacheManager.get(cacheKey);
        if (cachedPermissions) {
            console.log(`Returning permissions for ${module}:${action} from cache`);
            return cachedPermissions;
        }
        console.log(`Fetching permissions for ${module}:${action} from database`);
        const permissions = await this.permissionModel
            .find({ module, action })
            .exec();
        if (permissions.length > 0) {
            await this.cacheManager.set(cacheKey, permissions, 300000);
        }
        return permissions;
    }
    async update(id, updatePermissionDto) {
        const updatedPermission = await this.permissionModel
            .findOneAndUpdate({ id }, updatePermissionDto, { new: true })
            .exec();
        await this.cacheManager.del(`permission_${id}`);
        await this.cacheManager.del('all_permissions');
        return updatedPermission;
    }
    async remove(id) {
        await this.permissionModel.findOneAndDelete({ id }).exec();
        await this.cacheManager.del(`permission_${id}`);
        await this.cacheManager.del('all_permissions');
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(permission_schema_1.Permission.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map