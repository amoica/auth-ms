import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"

export class CreateRoleDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsOptional()
    description?: string

    @IsBoolean()
    isSystem: boolean;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    permissionIds: number[];
}
