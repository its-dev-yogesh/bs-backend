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
exports.RolePermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const role_permissions_service_1 = require("./role-permissions.service");
const create_role_permission_dto_1 = require("./dto/create-role-permission.dto");
const role_permission_schema_1 = require("./schemas/role-permission.schema");
let RolePermissionsController = class RolePermissionsController {
    rolePermissionsService;
    constructor(rolePermissionsService) {
        this.rolePermissionsService = rolePermissionsService;
    }
    async create(createRolePermissionDto) {
        return this.rolePermissionsService.create(createRolePermissionDto);
    }
    async findAll() {
        return this.rolePermissionsService.findAll();
    }
    async findByRole(role_name) {
        return this.rolePermissionsService.findByRole(role_name);
    }
    async findByPermissionId(permission_id) {
        return this.rolePermissionsService.findByPermissionId(permission_id);
    }
    async remove(role_name, permission_id) {
        return this.rolePermissionsService.remove(role_name, permission_id);
    }
    async removeByRole(role_name) {
        return this.rolePermissionsService.removeByRole(role_name);
    }
    async removeByPermissionId(permission_id) {
        return this.rolePermissionsService.removeByPermissionId(permission_id);
    }
};
exports.RolePermissionsController = RolePermissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assign permission to a role' }),
    (0, swagger_1.ApiBody)({ type: create_role_permission_dto_1.CreateRolePermissionDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permission assigned to role successfully',
        type: role_permission_schema_1.RolePermission,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Role-Permission mapping already exists',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_permission_dto_1.CreateRolePermissionDto]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all role-permission mappings' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all role-permission mappings',
        type: [role_permission_schema_1.RolePermission],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('role/:role_name'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all permissions for a role' }),
    (0, swagger_1.ApiParam)({ name: 'role_name', description: 'Role name', enum: role_permission_schema_1.RoleType }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Role permissions found',
        type: [role_permission_schema_1.RolePermission],
    }),
    __param(0, (0, common_1.Param)('role_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "findByRole", null);
__decorate([
    (0, common_1.Get)('permission/:permission_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles for a permission' }),
    (0, swagger_1.ApiParam)({ name: 'permission_id', description: 'Permission ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Roles with this permission found',
        type: [role_permission_schema_1.RolePermission],
    }),
    __param(0, (0, common_1.Param)('permission_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "findByPermissionId", null);
__decorate([
    (0, common_1.Delete)('role/:role_name/permission/:permission_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove permission from role' }),
    (0, swagger_1.ApiParam)({ name: 'role_name', description: 'Role name', enum: role_permission_schema_1.RoleType }),
    (0, swagger_1.ApiParam)({ name: 'permission_id', description: 'Permission ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permission removed from role successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Role-Permission mapping not found',
    }),
    __param(0, (0, common_1.Param)('role_name')),
    __param(1, (0, common_1.Param)('permission_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)('role/:role_name'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove all permissions from role' }),
    (0, swagger_1.ApiParam)({ name: 'role_name', description: 'Role name', enum: role_permission_schema_1.RoleType }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'All permissions removed from role successfully',
    }),
    __param(0, (0, common_1.Param)('role_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "removeByRole", null);
__decorate([
    (0, common_1.Delete)('permission/:permission_id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove permission from all roles' }),
    (0, swagger_1.ApiParam)({ name: 'permission_id', description: 'Permission ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permission removed from all roles successfully',
    }),
    __param(0, (0, common_1.Param)('permission_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RolePermissionsController.prototype, "removeByPermissionId", null);
exports.RolePermissionsController = RolePermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Role Permissions'),
    (0, common_1.Controller)('role-permissions'),
    __metadata("design:paramtypes", [role_permissions_service_1.RolePermissionsService])
], RolePermissionsController);
//# sourceMappingURL=role-permissions.controller.js.map