import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RolesService extends PrismaClient implements OnModuleInit {


  private readonly looger = new Logger('AuthService');

  onModuleInit() {
    this.$connect()
      .then(() => this.looger.log('Prisma Client connected to the database'))
      .catch((error) => this.looger.error('Error connecting to the database', error));

    this.looger.log('RoleService initialized and conected to the database');
  }

async create(createRoleDto: CreateRoleDto) {
  const { name, description, isSystem, permissionIds } = createRoleDto;

  try {
    // 1) Duplicados
    const existing = await this.role.findUnique({ where: { name } });
    if (existing) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'El nombre del rol ya se encuentra registrado'
      });
    }

    // 2) Insertar rol + asignar permisos
    const newRole = await this.role.create({
      data: {
        name,
        description,
        isSystem,
        // nested write en la relación "permissions"
        permissions: {
          create: (permissionIds || []).map(permissionId => ({
            permission: { connect: { id: permissionId } }
          }))
        }
      },
      include: {
        // para devolver también los permisos asociados
        permissions: {
          include: { permission: true }
        }
      }
    });

    return newRole;
  } catch (err) {
    if (err instanceof RpcException) throw err;
    this.looger.error('Error inesperado al crear el rol', err);
    throw new RpcException({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Error inesperado al crear el rol'
    });
  }
}
  findAll() {

    try {
      return this.role.findMany();
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error inesperado al crear el Role'
      });
    }

  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {

    try {
      return this.role.update({
        where: { id },
        data: updateRoleDto
      })
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error inesperado al Actulizar el Role'
      });
    }
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
