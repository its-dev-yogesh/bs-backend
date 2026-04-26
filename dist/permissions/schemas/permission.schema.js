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
exports.PermissionSchema = exports.Permission = exports.PermissionScope = exports.PermissionAction = exports.PermissionModule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
var PermissionModule;
(function (PermissionModule) {
    PermissionModule["POST"] = "post";
    PermissionModule["COMMENT"] = "comment";
    PermissionModule["USER"] = "user";
    PermissionModule["CHAT"] = "chat";
})(PermissionModule || (exports.PermissionModule = PermissionModule = {}));
var PermissionAction;
(function (PermissionAction) {
    PermissionAction["CREATE"] = "create";
    PermissionAction["READ"] = "read";
    PermissionAction["UPDATE"] = "update";
    PermissionAction["DELETE"] = "delete";
    PermissionAction["MODERATE"] = "moderate";
})(PermissionAction || (exports.PermissionAction = PermissionAction = {}));
var PermissionScope;
(function (PermissionScope) {
    PermissionScope["OWN"] = "own";
    PermissionScope["ANY"] = "any";
    PermissionScope["ASSIGNED"] = "assigned";
})(PermissionScope || (exports.PermissionScope = PermissionScope = {}));
let Permission = class Permission {
    id;
    module;
    action;
    scope;
    createdAt;
    updatedAt;
};
exports.Permission = Permission;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission ID (auto-incrementing)',
        example: 1,
    }),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PermissionModule }),
    (0, swagger_1.ApiProperty)({
        description: 'Resource module',
        enum: PermissionModule,
        example: PermissionModule.POST,
    }),
    __metadata("design:type", String)
], Permission.prototype, "module", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PermissionAction }),
    (0, swagger_1.ApiProperty)({
        description: 'Action to perform',
        enum: PermissionAction,
        example: PermissionAction.CREATE,
    }),
    __metadata("design:type", String)
], Permission.prototype, "action", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PermissionScope }),
    (0, swagger_1.ApiProperty)({
        description: 'Scope of the action',
        enum: PermissionScope,
        example: PermissionScope.OWN,
    }),
    __metadata("design:type", String)
], Permission.prototype, "scope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Permission creation timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Permission.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-04-26T19:00:00.000Z',
    }),
    __metadata("design:type", Date)
], Permission.prototype, "updatedAt", void 0);
exports.Permission = Permission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Permission);
exports.PermissionSchema = mongoose_1.SchemaFactory.createForClass(Permission);
exports.PermissionSchema.index({ module: 1 });
exports.PermissionSchema.index({ action: 1 });
exports.PermissionSchema.index({ module: 1, action: 1, scope: 1 }, { unique: true });
//# sourceMappingURL=permission.schema.js.map