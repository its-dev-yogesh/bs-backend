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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionSchema = exports.RolePermission = exports.RoleType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
var RoleType;
(function (RoleType) {
    RoleType["USER"] = "user";
    RoleType["AGENT"] = "agent";
})(RoleType || (exports.RoleType = RoleType = {}));
let RolePermission = class RolePermission {
    _id;
    role_name;
    permission_id;
    createdAt;
    updatedAt;
};
exports.RolePermission = RolePermission;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'MongoDB ID',
    }),
    __metadata("design:type", String)
], RolePermission.prototype, "_id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RoleType, index: true }),
    (0, swagger_1.ApiProperty)({
        description: 'Role name',
        enum: RoleType,
        example: RoleType.USER,
    }),
    __metadata("design:type", String)
], RolePermission.prototype, "role_name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    (0, swagger_1.ApiProperty)({
        description: 'Reference to Permission ID',
        example: 1,
    }),
    __metadata("design:type", Number)
], RolePermission.prototype, "permission_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Role-Permission creation timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], RolePermission.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], RolePermission.prototype, "updatedAt", void 0);
exports.RolePermission = RolePermission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], RolePermission);
exports.RolePermissionSchema = mongoose_1.SchemaFactory.createForClass(RolePermission);
exports.RolePermissionSchema.index({ role_name: 1 });
exports.RolePermissionSchema.index({ permission_id: 1 });
exports.RolePermissionSchema.index({ role_name: 1, permission_id: 1 }, { unique: true });
//# sourceMappingURL=role-permission.schema.js.map