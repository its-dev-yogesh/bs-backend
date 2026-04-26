import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { RoleType } from '../schemas/role-permission.schema';

export class CreateRolePermissionDto {
  @ApiProperty({
    example: 'user',
    description: 'Role name',
    enum: RoleType,
  })
  @IsNotEmpty()
  @IsEnum(RoleType)
  role_name: RoleType;

  @ApiProperty({
    example: 1,
    description: 'Permission ID',
  })
  @IsNotEmpty()
  @IsNumber()
  permission_id: number;
}
