import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class LoginUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
