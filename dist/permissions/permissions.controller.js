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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_service_1 = require("./permissions.service");
const create_permission_dto_1 = require("./dto/create-permission.dto");
const permission_schema_1 = require("./schemas/permission.schema");
let PermissionsController = class PermissionsController {
    permissionsService;
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async create(createPermissionDto) {
        return this.permissionsService.create(createPermissionDto);
    }
    async findAll() {
        return this.permissionsService.findAll();
    }
    async findById(id) {
        return this.permissionsService.findById(id);
    }
    async findByModuleAndAction(module, action) {
        return this.permissionsService.findByModuleAndAction(module, action);
    }
    async update(id, updatePermissionDto) {
        return this.permissionsService.update(id, updatePermissionDto);
    }
    async remove(id) {
        return this.permissionsService.remove(id);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new permission' }),
    (0, swagger_1.ApiBody)({ type: create_permission_dto_1.CreatePermissionDto }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Permission created successfully',
        type: permission_schema_1.Permission,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Permission already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all permissions' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all permissions',
        type: [permission_schema_1.Permission],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permission by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permission found',
        type: permission_schema_1.Permission,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)('module/:module/action/:action'),
    (0, swagger_1.ApiOperation)({ summary: 'Get permissions by module and action' }),
    (0, swagger_1.ApiParam)({
        name: 'module',
        description: 'Module name',
        enum: permission_schema_1.PermissionModule,
    }),
    (0, swagger_1.ApiParam)({
        name: 'action',
        description: 'Action name',
        enum: permission_schema_1.PermissionAction,
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permissions found',
        type: [permission_schema_1.Permission],
    }),
    __param(0, (0, common_1.Param)('module')),
    __param(1, (0, common_1.Param)('action')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "findByModuleAndAction", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update permission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission ID' }),
    (0, swagger_1.ApiBody)({ type: create_permission_dto_1.CreatePermissionDto }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permission updated successfully',
        type: permission_schema_1.Permission,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete permission' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Permission ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permission deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Permission not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "remove", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('Permissions'),
    (0, common_1.Controller)('permissions'),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map