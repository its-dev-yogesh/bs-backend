import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { RolePermissionsService } from './role-permissions.service';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';
import { RolePermission, RoleType } from './schemas/role-permission.schema';

@ApiTags('Role Permissions')
@Controller('role-permissions')
export class RolePermissionsController {
  constructor(private readonly rolePermissionsService: RolePermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Assign permission to a role' })
  @ApiBody({ type: CreateRolePermissionDto })
  @ApiResponse({
    status: 201,
    description: 'Permission assigned to role successfully',
    type: RolePermission,
  })
  @ApiResponse({ status: 400, description: 'Role-Permission mapping already exists' })
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission> {
    return this.rolePermissionsService.create(createRolePermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all role-permission mappings' })
  @ApiResponse({
    status: 200,
    description: 'List of all role-permission mappings',
    type: [RolePermission],
  })
  async findAll(): Promise<RolePermission[]> {
    return this.rolePermissionsService.findAll();
  }

  @Get('role/:role_name')
  @ApiOperation({ summary: 'Get all permissions for a role' })
  @ApiParam({ name: 'role_name', description: 'Role name', enum: RoleType })
  @ApiResponse({
    status: 200,
    description: 'Role permissions found',
    type: [RolePermission],
  })
  async findByRole(@Param('role_name') role_name: RoleType): Promise<RolePermission[]> {
    return this.rolePermissionsService.findByRole(role_name);
  }

  @Get('permission/:permission_id')
  @ApiOperation({ summary: 'Get all roles for a permission' })
  @ApiParam({ name: 'permission_id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Roles with this permission found',
    type: [RolePermission],
  })
  async findByPermissionId(@Param('permission_id') permission_id: number): Promise<RolePermission[]> {
    return this.rolePermissionsService.findByPermissionId(permission_id);
  }

  @Delete('role/:role_name/permission/:permission_id')
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiParam({ name: 'role_name', description: 'Role name', enum: RoleType })
  @ApiParam({ name: 'permission_id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission removed from role successfully',
  })
  @ApiResponse({ status: 404, description: 'Role-Permission mapping not found' })
  async remove(
    @Param('role_name') role_name: RoleType,
    @Param('permission_id') permission_id: number,
  ): Promise<void> {
    return this.rolePermissionsService.remove(role_name, permission_id);
  }

  @Delete('role/:role_name')
  @ApiOperation({ summary: 'Remove all permissions from role' })
  @ApiParam({ name: 'role_name', description: 'Role name', enum: RoleType })
  @ApiResponse({
    status: 200,
    description: 'All permissions removed from role successfully',
  })
  async removeByRole(@Param('role_name') role_name: RoleType): Promise<void> {
    return this.rolePermissionsService.removeByRole(role_name);
  }

  @Delete('permission/:permission_id')
  @ApiOperation({ summary: 'Remove permission from all roles' })
  @ApiParam({ name: 'permission_id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission removed from all roles successfully',
  })
  async removeByPermissionId(@Param('permission_id') permission_id: number): Promise<void> {
    return this.rolePermissionsService.removeByPermissionId(permission_id);
  }
}
