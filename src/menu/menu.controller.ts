import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { MenuService } from './menu.service';


@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern({cmd:'find_menu'})
  registerUser(@Payload() scope: string[]){
    return this.menuService.getMenuForUser(scope);
  }

 
}
