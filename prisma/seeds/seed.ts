import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 1. Crear Permisos
  const permisos = await prisma.permission.createMany({
    data: [
      // Dashboard
      { 
        name: 'dashboard:ver', 
        description: 'Ver el panel de control', 
        category: 'Dashboard' 
      },

      // Artículos
      { 
        name: 'articulos:ver', 
        description: 'Ver listado de artículos', 
        category: 'Artículos' 
      },
      { 
        name: 'articulos:crear', 
        description: 'Crear nuevos artículos', 
        category: 'Artículos' 
      },
      { 
        name: 'articulos:editar', 
        description: 'Modificar artículos existentes', 
        category: 'Artículos' 
      },
      { 
        name: 'articulos:eliminar', 
        description: 'Eliminar artículos', 
        category: 'Artículos' 
      },
      { 
        name: 'articulos:inventario', 
        description: 'Gestionar niveles de inventario', 
        category: 'Artículos' 
      },

      // Componentes
      { 
        name: 'componentes:ver', 
        description: 'Ver listado de componentes', 
        category: 'Componentes' 
      },
      { 
        name: 'componentes:gestionar', 
        description: 'Gestionar componentes', 
        category: 'Componentes' 
      },

      // Skids
      { 
        name: 'skids:ver', 
        description: 'Ver listado de skids', 
        category: 'Skids' 
      },
      { 
        name: 'skids:gestionar', 
        description: 'Gestionar skids', 
        category: 'Skids' 
      },
      { 
        name: 'skids:armar', 
        description: 'Armar skids con componentes', 
        category: 'Skids' 
      },

      // Movimientos
      { 
        name: 'movimientos:ver', 
        description: 'Ver movimientos de stock', 
        category: 'Movimientos' 
      },
      { 
        name: 'movimientos:registrar', 
        description: 'Registrar nuevos movimientos', 
        category: 'Movimientos' 
      },
      { 
        name: 'movimientos:aprobar', 
        description: 'Aprobar movimientos', 
        category: 'Movimientos' 
      },

      // Yacimientos/Ubicaciones
      { 
        name: 'ubicaciones:ver', 
        description: 'Ver yacimientos y ubicaciones', 
        category: 'Ubicaciones' 
      },
      { 
        name: 'ubicaciones:gestionar', 
        description: 'Gestionar ubicaciones', 
        category: 'Ubicaciones' 
      },

      // Proveedores
      { 
        name: 'proveedores:ver', 
        description: 'Ver listado de proveedores', 
        category: 'Proveedores' 
      },
      { 
        name: 'proveedores:gestionar', 
        description: 'Gestionar proveedores', 
        category: 'Proveedores' 
      },

      // Clientes
      { 
        name: 'clientes:ver', 
        description: 'Ver listado de clientes', 
        category: 'Clientes' 
      },
      { 
        name: 'clientes:gestionar', 
        description: 'Gestionar clientes', 
        category: 'Clientes' 
      },

      // Órdenes de Fabricación
      { 
        name: 'ordenes_fabricacion:ver', 
        description: 'Ver órdenes de fabricación', 
        category: 'Órdenes' 
      },
      { 
        name: 'ordenes_fabricacion:crear', 
        description: 'Crear órdenes de fabricación', 
        category: 'Órdenes' 
      },
      { 
        name: 'ordenes_fabricacion:gestionar', 
        description: 'Gestionar órdenes de fabricación', 
        category: 'Órdenes' 
      },

      // Órdenes de Trabajo
      { 
        name: 'ordenes_trabajo:ver', 
        description: 'Ver órdenes de trabajo', 
        category: 'Órdenes' 
      },
      { 
        name: 'ordenes_trabajo:ejecutar', 
        description: 'Ejecutar órdenes de trabajo', 
        category: 'Órdenes' 
      },

      // Órdenes de Compra
      { 
        name: 'ordenes_compra:ver', 
        description: 'Ver órdenes de compra', 
        category: 'Órdenes' 
      },
      { 
        name: 'ordenes_compra:crear', 
        description: 'Crear órdenes de compra', 
        category: 'Órdenes' 
      },
      { 
        name: 'ordenes_compra:aprobar', 
        description: 'Aprobar órdenes de compra', 
        category: 'Órdenes' 
      },

      // Reportes
      { 
        name: 'reportes:ver', 
        description: 'Ver reportes del sistema', 
        category: 'Reportes' 
      },
      { 
        name: 'reportes:generar', 
        description: 'Generar nuevos reportes', 
        category: 'Reportes' 
      },

      // Seguridad
      { 
        name: 'usuarios:gestionar', 
        description: 'Gestionar usuarios del sistema', 
        category: 'Seguridad' 
      },
      { 
        name: 'roles:gestionar', 
        description: 'Gestionar roles y permisos', 
        category: 'Seguridad' 
      }
    ],
    skipDuplicates: true
  });

  // 2. Crear Roles del Sistema
  const todosPermisos = await prisma.permission.findMany();
  const todosPermisoIds = todosPermisos.map(p => p.id);

  // Rol: Administrador
  await prisma.role.create({
    data: {
      name: 'Administrador',
      description: 'Acceso completo a todas las funcionalidades del sistema',
      isSystem: true,
      permissions: {
        create: todosPermisoIds.map(permissionId => ({ permissionId }))
      }
    }
  });

  // Rol: Jefe de Producción
  await prisma.role.create({
    data: {
      name: 'Jefe de Producción',
      description: 'Gestiona todo el flujo productivo',
      isSystem: true,
      permissions: {
        create: [
          'articulos:ver', 'articulos:crear', 'articulos:editar', 'articulos:inventario',
          'componentes:ver', 'componentes:gestionar',
          'skids:ver', 'skids:gestionar', 'skids:armar',
          'movimientos:ver', 'movimientos:registrar', 'movimientos:aprobar',
          'ubicaciones:ver', 'ubicaciones:gestionar',
          'ordenes_fabricacion:ver', 'ordenes_fabricacion:crear', 'ordenes_fabricacion:gestionar',
          'ordenes_trabajo:ver', 'ordenes_trabajo:ejecutar',
          'reportes:ver', 'reportes:generar'
        ].map(permName => ({
          permission: { connect: { name: permName } }
        }))
      }
    }
  });

  // Rol: Encargado de Depósito
  await prisma.role.create({
    data: {
      name: 'Encargado de Depósito',
      description: 'Gestiona inventario y movimientos de stock',
      isSystem: true,
      permissions: {
        create: [
          'articulos:ver', 'articulos:inventario',
          'skids:ver',
          'movimientos:ver', 'movimientos:registrar',
          'ubicaciones:ver', 'ubicaciones:gestionar',
          'reportes:ver'
        ].map(permName => ({
          permission: { connect: { name: permName } }
        }))
      }
    }
  });

  // 3. Crear Roles Personalizables
  // Rol: Comprador
  await prisma.role.create({
    data: {
      name: 'Comprador',
      description: 'Gestiona órdenes de compra y proveedores',
      isSystem: false,
      permissions: {
        create: [
          'proveedores:ver', 'proveedores:gestionar',
          'ordenes_compra:ver', 'ordenes_compra:crear',
          'articulos:ver',
          'reportes:ver'
        ].map(permName => ({
          permission: { connect: { name: permName } }
        }))
      }
    }
  });

  // Rol: Vendedor
  await prisma.role.create({
    data: {
      name: 'Vendedor',
      description: 'Atención a clientes y ventas',
      isSystem: false,
      permissions: {
        create: [
          'clientes:ver', 'clientes:gestionar',
          'articulos:ver',
          'skids:ver',
          'reportes:ver'
        ].map(permName => ({
          permission: { connect: { name: permName } }
        }))
      }
    }
  });

  // Rol: Operario
  await prisma.role.create({
    data: {
      name: 'Operario',
      description: 'Ejecuta órdenes de trabajo',
      isSystem: false,
      permissions: {
        create: [
          'ordenes_trabajo:ver', 'ordenes_trabajo:ejecutar',
          'skids:ver',
          'componentes:ver',
          'movimientos:registrar'
        ].map(permName => ({
          permission: { connect: { name: permName } }
        }))
      }
    }
  });

  console.log('Seed completado exitosamente!');
}

main()
  .catch(e => {
    console.error('Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });