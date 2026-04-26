import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Model } from 'mongoose';
import type { Cache } from 'cache-manager';
import { Permission } from './schemas/permission.schema';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    // Check if permission already exists
    const existingPermission = await this.permissionModel.findOne({
      module: createPermissionDto.module,
      action: createPermissionDto.action,
      scope: createPermissionDto.scope,
    });

    if (existingPermission) {
      throw new BadRequestException('This permission already exists');
    }

    const createdPermission = new this.permissionModel(createPermissionDto);
    const savedPermission = await createdPermission.save();

    // Clear cache
    await this.cacheManager.del('all_permissions');

    return savedPermission;
  }

  async findAll(): Promise<Permission[]> {
    const cacheKey = 'all_permissions';

    // Try to get from cache
    const cachedPermissions = await this.cacheManager.get<Permission[]>(cacheKey);
    if (cachedPermissions) {
      console.log('Returning permissions from cache');
      return cachedPermissions;
    }

    console.log('Fetching permissions from database');
    const permissions = await this.permissionModel.find().exec();

    // Store in cache for 5 minutes
    await this.cacheManager.set(cacheKey, permissions, 300000);

    return permissions;
  }

  async findById(id: number): Promise<Permission | null> {
    const cacheKey = `permission_${id}`;

    // Try to get from cache
    const cachedPermission = await this.cacheManager.get<Permission>(cacheKey);
    if (cachedPermission) {
      console.log(`Returning permission ${id} from cache`);
      return cachedPermission;
    }

    console.log(`Fetching permission ${id} from database`);
    const permission = await this.permissionModel.findOne({ id }).exec();

    if (permission) {
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, permission, 300000);
    }

    return permission;
  }

  async findByModuleAndAction(
    module: string,
    action: string,
  ): Promise<Permission[]> {
    const cacheKey = `permissions_${module}_${action}`;

    // Try to get from cache
    const cachedPermissions = await this.cacheManager.get<Permission[]>(cacheKey);
    if (cachedPermissions) {
      console.log(`Returning permissions for ${module}:${action} from cache`);
      return cachedPermissions;
    }

    console.log(`Fetching permissions for ${module}:${action} from database`);
    const permissions = await this.permissionModel
      .find({ module, action })
      .exec();

    if (permissions.length > 0) {
      // Store in cache for 5 minutes
      await this.cacheManager.set(cacheKey, permissions, 300000);
    }

    return permissions;
  }

  async update(
    id: number,
    updatePermissionDto: Partial<CreatePermissionDto>,
  ): Promise<Permission | null> {
    const updatedPermission = await this.permissionModel
      .findOneAndUpdate({ id }, updatePermissionDto, { new: true })
      .exec();

    // Clear related caches
    await this.cacheManager.del(`permission_${id}`);
    await this.cacheManager.del('all_permissions');

    return updatedPermission;
  }

  async remove(id: number): Promise<void> {
    await this.permissionModel.findOneAndDelete({ id }).exec();

    // Clear related caches
    await this.cacheManager.del(`permission_${id}`);
    await this.cacheManager.del('all_permissions');
  }
}
