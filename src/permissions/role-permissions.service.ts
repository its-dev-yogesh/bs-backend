import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { RolePermission, RoleType } from './schemas/role-permission.schema';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Injectable()
export class RolePermissionsService {
  constructor(
    @InjectModel(RolePermission.name) private rolePermissionModel: Model<RolePermission>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createRolePermissionDto: CreateRolePermissionDto): Promise<RolePermission> {
    // Check if role-permission mapping already exists
    const existing = await this.rolePermissionModel.findOne({
      role_name: createRolePermissionDto.role_name,
      permission_id: createRolePermissionDto.permission_id,
    });

    if (existing) {
      throw new BadRequestException('This role-permission mapping already exists');
    }

    const createdRolePermission = new this.rolePermissionModel(createRolePermissionDto);
    const savedRolePermission = await createdRolePermission.save();

    // Clear cache
    await this.cacheManager.del(`role_permissions_${createRolePermissionDto.role_name}`);

    return savedRolePermission;
  }

  async findByRole(role_name: RoleType): Promise<RolePermission[]> {
    const cacheKey = `role_permissions_${role_name}`;

    // Try to get from cache
    const cachedRolePermissions = await this.cacheManager.get<RolePermission[]>(cacheKey);
    if (cachedRolePermissions) {
      console.log(`Returning permissions for role ${role_name} from cache`);
      return cachedRolePermissions;
    }

    console.log(`Fetching permissions for role ${role_name} from database`);
    const rolePermissions = await this.rolePermissionModel
      .find({ role_name })
      .exec();

    if (rolePermissions.length > 0) {
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, rolePermissions, 300000);
    }

    return rolePermissions;
  }

  async findAll(): Promise<RolePermission[]> {
    const cacheKey = 'all_role_permissions';

    // Try to get from cache
    const cachedRolePermissions = await this.cacheManager.get<RolePermission[]>(cacheKey);
    if (cachedRolePermissions) {
      console.log('Returning all role permissions from cache');
      return cachedRolePermissions;
    }

    console.log('Fetching all role permissions from database');
    const rolePermissions = await this.rolePermissionModel.find().exec();

    // Store in cache for 5 minutes
    await this.cacheManager.set(cacheKey, rolePermissions, 300000);

    return rolePermissions;
  }

  async findByPermissionId(permission_id: number): Promise<RolePermission[]> {
    const cacheKey = `role_permissions_perm_${permission_id}`;

    // Try to get from cache
    const cachedRolePermissions = await this.cacheManager.get<RolePermission[]>(cacheKey);
    if (cachedRolePermissions) {
      console.log(`Returning role permissions for permission ${permission_id} from cache`);
      return cachedRolePermissions;
    }

    console.log(`Fetching role permissions for permission ${permission_id} from database`);
    const rolePermissions = await this.rolePermissionModel
      .find({ permission_id })
      .exec();

    if (rolePermissions.length > 0) {
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, rolePermissions, 300000);
    }

    return rolePermissions;
  }

  async remove(role_name: RoleType, permission_id: number): Promise<void> {
    await this.rolePermissionModel
      .findOneAndDelete({ role_name, permission_id })
      .exec();

    // Clear related caches
    await this.cacheManager.del(`role_permissions_${role_name}`);
    await this.cacheManager.del(`role_permissions_perm_${permission_id}`);
    await this.cacheManager.del('all_role_permissions');
  }

  async removeByRole(role_name: RoleType): Promise<void> {
    await this.rolePermissionModel.deleteMany({ role_name }).exec();

    // Clear related caches
    await this.cacheManager.del(`role_permissions_${role_name}`);
    await this.cacheManager.del('all_role_permissions');
  }

  async removeByPermissionId(permission_id: number): Promise<void> {
    await this.rolePermissionModel.deleteMany({ permission_id }).exec();

    // Clear related caches
    await this.cacheManager.del(`role_permissions_perm_${permission_id}`);
    await this.cacheManager.del('all_role_permissions');
  }
}
