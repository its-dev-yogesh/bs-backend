import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import {
  PermissionModule,
  PermissionAction,
  PermissionScope,
} from '../schemas/permission.schema';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'post',
    description: 'Resource module',
    enum: PermissionModule,
  })
  @IsNotEmpty()
  @IsEnum(PermissionModule)
  module: PermissionModule;

  @ApiProperty({
    example: 'create',
    description: 'Action to perform',
    enum: PermissionAction,
  })
  @IsNotEmpty()
  @IsEnum(PermissionAction)
  action: PermissionAction;

  @ApiProperty({
    example: 'own',
    description: 'Scope of the action',
    enum: PermissionScope,
  })
  @IsNotEmpty()
  @IsEnum(PermissionScope)
  scope: PermissionScope;
}
