import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { LoginUserDto, RegisterUserDto } from './dto';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd:'auth.register.user'})
  registerUser(@Payload() registerUserDto: RegisterUserDto){
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern({cmd:'auth.login.user'})
  loginUser(@Payload() loginUserDto: LoginUserDto){
    console.log(loginUserDto);
    return this.authService.logiUser(loginUserDto);
  }

  @MessagePattern({cmd:'auth.verify.user'})
  verifyToken( @Payload() token: string){
    return this.authService.verifyToken(token)
  }
 
}
