import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoginUserDto, RegisterUserDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import * as brcypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/interfaces/jwt-payload.interface';
import { envs } from 'src/config';


@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {

  private readonly looger = new Logger('AuthService');

  constructor(
    private readonly jwtService: JwtService
  ) {
    super();
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload)
  }

  async verifyToken(token: string) {

    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret
      });

      return {
        user: user,
        token: await this.signJWT(user)
      }

    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Token invalido'
      })
    }
  }

  onModuleInit() {
    this.$connect()
      .then(() => this.looger.log('Prisma Client connected to the database'))
      .catch((error) => this.looger.error('Error connecting to the database', error));

    this.looger.log('AuthService initialized and conected to the database');
  }

  async registerUser(dto: RegisterUserDto) {

    const { email, password, firstName, lastName, dni, phone, address, createBy } = dto
    try {

      const userExist = await this.user.findUnique({
        where: {
          email
        }
      });

      if (userExist) {
        throw new RpcException({
          status: 400,
          message: 'User already exists'
        })
      }

      let roleId = dto.roleId;

      if (!roleId) {
        const defaultRole = await this.role.findUnique({
          where: { name: 'CONSULTAS' }
        })

        if (defaultRole) {
          roleId = defaultRole.id
        }


      }

      // Crear usuario
      const user = await this.user.create({
        data: {
          email: dto.email,
          password: brcypt.hashSync(password, 10),
          roleId: roleId!,
          createBy: createBy,
          profile: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              dni: dto.dni,
              phone: dto.phone,
              address: dto.address,
            },
          },
        },
        include: {
          profile: true,
          role: {
          include: {
            permissions: { include: { permission: true } }
          }
        }
        },
      });

      const scopes = user.role.permissions.map(rp => rp.permission.name);


      const newUser = {
        id: user.id,
        email,
        role:user.role.name,
        scopes
      }


      return {
        message: 'Usuario registrado correctamente',
        newUser,
        token: await this.signJWT(newUser)
      };


    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      })
    }
  }

  async logiUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    // 1️⃣ Traer usuario junto con rol y permisos
    const user = await this.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } }
          }
        }
      }
    });

    if (!user || !brcypt.compareSync(password, user.password)) {
      throw new RpcException({ status: 400, message: 'Email/Password inválidos' });
    }

    // 2️⃣ Extraer scopes de todos los permisos asociados
    const scopes = user.role.permissions.map(rp => rp.permission.name);

    // 3️⃣ Construir el payload del JWT
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      scopes,           // [ 'articulos:module', 'articulos:ver', ... ]
      role: user.role.name,
    };

    // 4️⃣ Firmar el token
    const token = await this.signJWT(payload);

    // 5️⃣ Devolver usuario + scopes + token
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role.name,
        scopes,               // para el frontend también es útil tenerlos directamente
      },
      token,
    };
  }

}
