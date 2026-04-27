import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type RolePermissionDocument = HydratedDocument<RolePermission>;

export enum RoleType {
  USER = 'user',
  AGENT = 'agent',
}

@Schema({ timestamps: true })
export class RolePermission {
  @ApiProperty({
    description: 'MongoDB ID',
  })
  _id?: string;

  @Prop({ required: true, enum: RoleType, index: true })
  @ApiProperty({
    description: 'Role name',
    enum: RoleType,
    example: RoleType.USER,
  })
  role_name: RoleType;

  @Prop({ required: true, type: Number })
  @ApiProperty({
    description: 'Reference to Permission ID',
    example: 1,
  })
  permission_id: number;

  @ApiProperty({
    description: 'Role-Permission creation timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-04-26T19:00:00.000Z',
  })
  updatedAt?: Date;
}

export const RolePermissionSchema =
  SchemaFactory.createForClass(RolePermission);

// Create indexes for better query performance
RolePermissionSchema.index({ role_name: 1 });
RolePermissionSchema.index({ permission_id: 1 });
RolePermissionSchema.index(
  { role_name: 1, permission_id: 1 },
  { unique: true },
);
