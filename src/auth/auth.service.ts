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
  ){
    super();
  }

  async signJWT( payload: JwtPayload){
    return this.jwtService.sign(payload)
  }

  async verifyToken(token:string){

    try {
      const {sub, iat, exp, ...user} = this.jwtService.verify(token, {
        secret: envs.jwtSecret
      });

      return {
        user:user,
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
          roleId :roleId!,
          createBy:createBy,
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
          role: true,
        },
      });



      const newUser = {
        id:user.id,
        email,
        roleId
      }

     
      return {
        message: 'Usuario registrado correctamente',
        newUser,
        token: await this.signJWT(newUser)
      };


    } catch (error) {
      throw new RpcException({
        status:400,
        message: error.message
      })
    }
  }

  async logiUser(loginUserDto: LoginUserDto){
    const {email, password} = loginUserDto;

    const user = await this.user.findUnique({
      where: {
        email
      }
    });

    if(!user){
      throw new RpcException({
        status: 400,
        message: 'Email/Password invalidos'
      })
    }

    const isPasswordValid = brcypt.compareSync(password, user.password);

    if(!isPasswordValid){
      throw new RpcException({
        status:400,
        message: 'Email/Password invalidos'
      })
    }

    const {password: __, ...rest} = user;

    return {
      user:rest,
      token: await this.signJWT(rest)
    }

  }

}
