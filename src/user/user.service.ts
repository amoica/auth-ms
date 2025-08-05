import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RpcException } from '@nestjs/microservices';
import * as brcypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class UserService extends PrismaClient implements OnModuleInit {

  private readonly looger = new Logger('AuthService');

  onModuleInit() {
    this.$connect()
      .then(() => this.looger.log('Prisma Client connected to the database'))
      .catch((error) => this.looger.error('Error connecting to the database', error));

    this.looger.log('UserService initialized and conected to the database');
  }

  async create(createUserDto: CreateUserDto) {
    const {
      email,
      password,
      roleId: incomingRoleId,
      firstName,
      lastName,
      dni,
      phone,
      address,
      avatarUrl
    } = createUserDto;

    // 1) chequeo duplicado
    const exists = await this.user.findUnique({ where: { email } });
    if (exists) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'El email ya está registrado'
      });
    }

    // 2) rol por defecto si hace falta
    let roleId = incomingRoleId;
    if (!roleId) {
      const defaultRole = await this.role.findUnique({
        where: { name: 'CONSULTAS' }
      });
      roleId = defaultRole?.id;
    }

    // 3) hash de password
    const hashed = await brcypt.hash(password, 10);

    // 4) crear usuario + perfil en nested write
    const user = await this.user.create({
      data: {
        email,
        password: hashed,
        roleId: roleId!,
        profile: {
          create: {
            firstName,
            lastName,
            dni,
            phone,
            address,
            avatarUrl
          }
        }
      },
      include: {
        role: true,
        profile: true
      }
    });

    return user;
  }

  findAll() {
    return this.user.findMany({
      include: { role: true, profile: true }
    });
  }

  async findOne(id: number) {
    const user = await this.user.findUnique({
      where: { id },
      include: { role: true, profile: true }
    });
    if (!user) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: 'Usuario no encontrado'
      });
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // 1) Extrae id, avatarUrl y password para no incluirlos en el root de data
    const { id: _unused, avatarUrl, password, ...fields } = updateUserDto as any;

    // 2) Si hay password, lo hasheas y lo pones en fields
    if (password) {
      fields.password = await brcypt.hash(password, 10);
    }

    // 3) Ahora Prisma recibe sólo los campos válidos en el root
    const user = await this.user.update({
      where: { id },
      data: {
        ...fields,           // sólo email, roleId, createBy, estado, etc.
        profile: {
          upsert: {
            create: {
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
              dni: updateUserDto.dni,
              phone: updateUserDto.phone,
              address: updateUserDto.address,
              avatarUrl: avatarUrl      // aquí sí metes avatarUrl
            },
            update: {
              firstName: updateUserDto.firstName,
              lastName: updateUserDto.lastName,
              dni: updateUserDto.dni,
              phone: updateUserDto.phone,
              address: updateUserDto.address,
              avatarUrl: avatarUrl      // y aquí también
            }
          }
        }
      },
      include: { role: true, profile: true }
    });

    return user;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
