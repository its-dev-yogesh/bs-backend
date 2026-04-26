import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission, PermissionModule, PermissionAction } from './schemas/permission.schema';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({
    status: 201,
    description: 'Permission created successfully',
    type: Permission,
  })
  @ApiResponse({ status: 400, description: 'Permission already exists' })
  async create(@Body() createPermissionDto: CreatePermissionDto): Promise<Permission> {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiResponse({
    status: 200,
    description: 'List of all permissions',
    type: [Permission],
  })
  async findAll(): Promise<Permission[]> {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission found',
    type: Permission,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async findById(@Param('id') id: number): Promise<Permission | null> {
    return this.permissionsService.findById(id);
  }

  @Get('module/:module/action/:action')
  @ApiOperation({ summary: 'Get permissions by module and action' })
  @ApiParam({ name: 'module', description: 'Module name', enum: PermissionModule })
  @ApiParam({ name: 'action', description: 'Action name', enum: PermissionAction })
  @ApiResponse({
    status: 200,
    description: 'Permissions found',
    type: [Permission],
  })
  async findByModuleAndAction(
    @Param('module') module: string,
    @Param('action') action: string,
  ): Promise<Permission[]> {
    return this.permissionsService.findByModuleAndAction(module, action);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({
    status: 200,
    description: 'Permission updated successfully',
    type: Permission,
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async update(
    @Param('id') id: number,
    @Body() updatePermissionDto: Partial<CreatePermissionDto>,
  ): Promise<Permission | null> {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete permission' })
  @ApiParam({ name: 'id', description: 'Permission ID' })
  @ApiResponse({
    status: 200,
    description: 'Permission deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.permissionsService.remove(id);
  }
}
