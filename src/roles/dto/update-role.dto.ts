import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from './create-role.dto';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({each: true})
  @Type(() => Number)
  @IsNotEmpty()
  permissionIds: number[];
}
