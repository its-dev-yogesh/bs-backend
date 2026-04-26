import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PermissionDocument = HydratedDocument<Permission>;

export enum PermissionModule {
  POST = 'post',
  COMMENT = 'comment',
  USER = 'user',
  CHAT = 'chat',
}

export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MODERATE = 'moderate',
}

export enum PermissionScope {
  OWN = 'own',
  ANY = 'any',
  ASSIGNED = 'assigned',
}

@Schema({ timestamps: true })
export class Permission {
  @ApiProperty({
    description: 'Permission ID (auto-incrementing)',
    example: 1,
  })
  id?: number;

  @Prop({ required: true, enum: PermissionModule })
  @ApiProperty({
    description: 'Resource module',
    enum: PermissionModule,
    example: PermissionModule.POST,
  })
  module: PermissionModule;

  @Prop({ required: true, enum: PermissionAction })
  @ApiProperty({
    description: 'Action to perform',
    enum: PermissionAction,
    example: PermissionAction.CREATE,
  })
  action: PermissionAction;

  @Prop({ required: true, enum: PermissionScope })
  @ApiProperty({
    description: 'Scope of the action',
    enum: PermissionScope,
    example: PermissionScope.OWN,
  })
  scope: PermissionScope;

  @ApiProperty({
    description: 'Permission creation timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  updatedAt?: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

// Create indexes for better query performance
PermissionSchema.index({ module: 1 });
PermissionSchema.index({ action: 1 });
PermissionSchema.index({ module: 1, action: 1, scope: 1 }, { unique: true });
