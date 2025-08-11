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

  // ----------------- Utils -----------------
  private normalizeRoute(route: string) {
    if (!route) return route;
    return route.startsWith('/') ? route : `/${route}`;
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
      where: {
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


  // ----------------- Core para auth/dashboard -----------------

  /**
   * Permisos efectivos (names) + rutas (menu) para un userId
   */
  async findByUser(userId: number) {
    // 1) Traer rol del usuario
    const user = await this.user.findUnique({
      where: { id: userId },
      select: { id: true, roleId: true, role: { select: { id: true, name: true } } },
    });
    if (!user) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Usuario #${userId} no encontrado`,
      } as any);
    }

    // 2) Permisos del rol
    const rolePerms = await this.rolePermission.findMany({
      where: { roleId: user.roleId },
      select: { permission: { select: { id: true, name: true } } },
    });

    const permissionIds = rolePerms.map(rp => rp.permission.id);
    const permissions = rolePerms.map(rp => rp.permission.name);

    // 3) Rutas del menú habilitadas por esos permisos
    const menu = await this.menuItem.findMany({
      where: { permissionId: { in: permissionIds } },
      select: { route: true },
      orderBy: [{ section: 'asc' }, { order: 'asc' }],
    });
    const routes = menu.map(m => this.normalizeRoute(m.route));

    return {
      role: user.role?.name ?? null,
      permissions,        // ej: ['articulos:read', 'skids:module', ...]
      routes,             // ej: ['/gestion-articulos/articulo', '/reportes', ...]
    };
  }

  /**
   * Permisos (names) por nombre de rol
   */
  async findByRoleName(roleName: string) {
    const role = await this.role.findUnique({
      where: { name: roleName },
      select: { id: true, name: true },
    });
    if (!role) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Rol "${roleName}" no encontrado`,
      } as any);
    }

    const rolePerms = await this.rolePermission.findMany({
      where: { roleId: role.id },
      select: { permission: { select: { id: true, name: true } } },
    });

    return rolePerms.map(rp => rp.permission.name);
  }

  /**
   * (si lo querés) Rutas por rolId – útil para armar menú por rol
   */
  async findRoutesByRoleId(roleId: number) {
    const rolePerms = await this.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    });
    const permIds = rolePerms.map(rp => rp.permissionId);

    const menu = await this.menuItem.findMany({
      where: { permissionId: { in: permIds } },
      select: { route: true },
      orderBy: [{ section: 'asc' }, { order: 'asc' }],
    });

    return menu.map(m => this.normalizeRoute(m.route));
  }

  /**
   * Si querés seguir exponiendo “permissions include …” por rolId
   */
  getPermissionsByRole(roleId: number) {
    return this.rolePermission.findMany({
      where: { roleId },
      include: { permission: true },
    });
  }
}
