import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class RegisterUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    dni?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsNumber()
    roleId?: number; // podés omitirlo y setear uno por defecto si no viene

    @IsOptional()
    @IsNumber()
    createBy?: number
}