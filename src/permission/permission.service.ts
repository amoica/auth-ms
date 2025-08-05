import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PermissionService extends PrismaClient implements OnModuleInit {

  private readonly looger = new Logger('AuthService');


  onModuleInit() {
    this.$connect()
      .then(() => this.looger.log('Prisma Client connected to the database'))
      .catch((error) => this.looger.error('Error connecting to the database', error));

    this.looger.log('Permissons initialized and conected to the database');
  }


  async create(createPermissionDto: CreatePermissionDto) {

    const { name, category } = createPermissionDto;
    try {
      const existing = await this.permission.findFirst({
        where: {
          name,
          category
        }
      })

      if (existing) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: `El permiso "${name}" ya está registrado en categoría "${category}".`
        })
      }

    } catch (error) {

    }
  }

  findAll() {
    return this.permission.findMany();
  }

  findOne(id: number) {
    return this.permission.findUnique({
      where:{
        id
      }
    });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.permission.update({
      where: { id },
      data: updatePermissionDto
    });
  }

  remove(roleId: number) {

  }

   getPermissionsByRole(roleId: number) {
    return this.rolePermission.findMany({
      where: { roleId },
      include: { permission: true }
    });
  }
}
