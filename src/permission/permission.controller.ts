import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @MessagePattern('createPermission')
  create(@Payload() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @MessagePattern('findAllPermission')
  findAll() {
    return this.permissionService.findAll();
  }

  @MessagePattern('findOnePermission')
  findOne(@Payload() id: number) {
    return this.permissionService.findOne(id);
  }

  @MessagePattern('updatePermission')
  update(@Payload() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionService.update(updatePermissionDto.id, updatePermissionDto);
  }

  @MessagePattern('removePermission')
  remove(@Payload() id: number) {
    return this.permissionService.remove(id);
  }

  @MessagePattern('getPermissionByRole')
  getPermissionsByRole(@Payload() roleId: number) {
    return this.permissionService.getPermissionsByRole(roleId);
  }

  @MessagePattern('getPermissionByUser')
  getPermissionByUser(@Payload() { userId }: { userId: number }) {
    return this.permissionService.findByUser(userId); // => string[] | {route: string}[]
  }

  // Por nombre de rol
  @MessagePattern('getPermissionByRoleName')
  getPermissionByRoleName(@Payload() { role }: { role: string }) {
    return this.permissionService.findByRoleName(role);
  }
}
