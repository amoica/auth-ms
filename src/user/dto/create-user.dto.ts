import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsInt()
    @IsOptional()         // si no lo envías, usaremos rol por defecto
    roleId?: number;

    @IsString() @IsOptional() firstName?: string;
    @IsString() @IsOptional() lastName?: string;
    @IsString() @IsOptional() dni?: string;
    @IsString() @IsOptional() phone?: string;
    @IsString() @IsOptional() address?: string;
    @IsString() @IsOptional() avatarUrl?:string
}
