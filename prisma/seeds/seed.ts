import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Crear todos los permisos (módulo + CRUD)
  const permisoData = [
    // Módulos
    { name: 'dashboard:module',    description: 'Acceso al módulo Dashboard',                category: 'Dashboard' },
    { name: 'articulos:module',    description: 'Acceso al módulo Artículos',                category: 'Artículos' },
    { name: 'componentes:module',  description: 'Acceso al módulo Componentes',              category: 'Componentes' },
    { name: 'skids:module',        description: 'Acceso al módulo Skids',                    category: 'Skids' },
    { name: 'movimientos:module',  description: 'Acceso al módulo Movimientos',              category: 'Movimientos' },
    { name: 'ubicaciones:module',  description: 'Acceso al módulo Ubicaciones',              category: 'Ubicaciones' },
    { name: 'proveedores:module',  description: 'Acceso al módulo Proveedores',              category: 'Proveedores' },
    { name: 'clientes:module',     description: 'Acceso al módulo Clientes',                 category: 'Clientes' },
    { name: 'ordenes_fabricacion:module', description: 'Acceso al módulo Órdenes de Fabricación', category: 'Órdenes' },
    { name: 'ordenes_trabajo:module',     description: 'Acceso al módulo Órdenes de Trabajo',      category: 'Órdenes' },
    { name: 'ordenes_compra:module',      description: 'Acceso al módulo Órdenes de Compra',       category: 'Órdenes' },
    { name: 'reportes:module',    description: 'Acceso al módulo Reportes',                 category: 'Reportes' },
    { name: 'seguridad:module',   description: 'Acceso al módulo Seguridad',                category: 'Seguridad' },

    // Dashboard
    { name: 'dashboard:ver',      description: 'Ver el panel de control',                   category: 'Dashboard' },

    // Artículos
    { name: 'articulos:ver',      description: 'Ver listado de artículos',                  category: 'Artículos' },
    { name: 'articulos:crear',    description: 'Crear nuevos artículos',                    category: 'Artículos' },
    { name: 'articulos:editar',   description: 'Modificar artículos existentes',            category: 'Artículos' },
    { name: 'articulos:eliminar', description: 'Eliminar artículos',                        category: 'Artículos' },
    { name: 'articulos:inventario', description: 'Gestionar niveles de inventario',          category: 'Artículos' },

    // Componentes
    { name: 'componentes:ver',    description: 'Ver listado de componentes',                category: 'Componentes' },
    { name: 'componentes:gestionar', description: 'Gestionar componentes',                  category: 'Componentes' },

    // Skids
    { name: 'skids:ver',          description: 'Ver listado de skids',                      category: 'Skids' },
    { name: 'skids:gestionar',    description: 'Gestionar skids',                           category: 'Skids' },
    { name: 'skids:armar',        description: 'Armar skids con componentes',               category: 'Skids' },

    // Movimientos
    { name: 'movimientos:ver',       description: 'Ver movimientos de stock',              category: 'Movimientos' },
    { name: 'movimientos:registrar', description: 'Registrar nuevos movimientos',          category: 'Movimientos' },
    { name: 'movimientos:aprobar',   description: 'Aprobar movimientos',                   category: 'Movimientos' },

    // Ubicaciones
    { name: 'ubicaciones:ver',      description: 'Ver yacimientos y ubicaciones',          category: 'Ubicaciones' },
    { name: 'ubicaciones:gestionar', description: 'Gestionar ubicaciones',                 category: 'Ubicaciones' },

    // Proveedores
    { name: 'proveedores:ver',      description: 'Ver listado de proveedores',             category: 'Proveedores' },
    { name: 'proveedores:gestionar', description: 'Gestionar proveedores',                  category: 'Proveedores' },

    // Clientes
    { name: 'clientes:ver',         description: 'Ver listado de clientes',                category: 'Clientes' },
    { name: 'clientes:gestionar',   description: 'Gestionar clientes',                     category: 'Clientes' },

    // Órdenes de Fabricación
    { name: 'ordenes_fabricacion:ver',      description: 'Ver órdenes de fabricación',      category: 'Órdenes' },
    { name: 'ordenes_fabricacion:crear',    description: 'Crear órdenes de fabricación',    category: 'Órdenes' },
    { name: 'ordenes_fabricacion:gestionar', description: 'Gestionar órdenes de fabricación', category: 'Órdenes' },

    // Órdenes de Trabajo
    { name: 'ordenes_trabajo:ver',    description: 'Ver órdenes de trabajo',             category: 'Órdenes' },
    { name: 'ordenes_trabajo:ejecutar', description: 'Ejecutar órdenes de trabajo',      category: 'Órdenes' },

    // Órdenes de Compra
    { name: 'ordenes_compra:ver',    description: 'Ver órdenes de compra',               category: 'Órdenes' },
    { name: 'ordenes_compra:crear',  description: 'Crear órdenes de compra',             category: 'Órdenes' },
    { name: 'ordenes_compra:aprobar', description: 'Aprobar órdenes de compra',          category: 'Órdenes' },

    // Reportes
    { name: 'reportes:ver',      description: 'Ver reportes del sistema',              category: 'Reportes' },
    { name: 'reportes:generar',  description: 'Generar nuevos reportes',               category: 'Reportes' },

    // Seguridad
    { name: 'usuarios:gestionar', description: 'Gestionar usuarios del sistema',        category: 'Seguridad' },
    { name: 'roles:gestionar',   description: 'Gestionar roles y permisos',            category: 'Seguridad' },
  ];

  await prisma.permission.createMany({
    data: permisoData,
    skipDuplicates: true,
  });

  // 2. Mapear permisos por nombre
  const permisos = await prisma.permission.findMany();
  const byName = permisos.reduce<Record<string, number>>((acc, p) => {
    acc[p.name] = p.id;
    return acc;
  }, {});

  // 3. Crear Roles del Sistema y sus permisos
  // — Administrador: todos los permisos
  await prisma.role.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: {
      name: 'Administrador',
      description: 'Acceso completo a todas las funcionalidades del sistema',
      isSystem: true,
      permissions: {
        create: Object.values(byName).map((permissionId) => ({ permissionId })),
      }
    }
  });

  // — Jefe de Producción
  await prisma.role.upsert({
    where: { name: 'Jefe de Producción' },
    update: {},
    create: {
      name: 'Jefe de Producción',
      description: 'Gestiona todo el flujo productivo',
      isSystem: true,
      permissions: {
        create: [
          'dashboard:module',
          'articulos:module', 'articulos:ver', 'articulos:crear', 'articulos:editar', 'articulos:inventario',
          'componentes:module', 'componentes:ver', 'componentes:gestionar',
          'skids:module', 'skids:ver', 'skids:gestionar', 'skids:armar',
          'movimientos:module', 'movimientos:ver', 'movimientos:registrar', 'movimientos:aprobar',
          'ubicaciones:module', 'ubicaciones:ver', 'ubicaciones:gestionar',
          'ordenes_fabricacion:module', 'ordenes_fabricacion:ver', 'ordenes_fabricacion:crear', 'ordenes_fabricacion:gestionar',
          'ordenes_trabajo:module', 'ordenes_trabajo:ver', 'ordenes_trabajo:ejecutar',
          'reportes:module', 'reportes:ver', 'reportes:generar'
        ].map(name => ({ permissionId: byName[name] }))
      }
    }
  });

  // — Encargado de Depósito
  await prisma.role.upsert({
    where: { name: 'Encargado de Depósito' },
    update: {},
    create: {
      name: 'Encargado de Depósito',
      description: 'Gestiona inventario y movimientos de stock',
      isSystem: true,
      permissions: {
        create: [
          'articulos:module', 'articulos:ver', 'articulos:inventario',
          'skids:module', 'skids:ver',
          'movimientos:module', 'movimientos:ver', 'movimientos:registrar',
          'ubicaciones:module', 'ubicaciones:ver', 'ubicaciones:gestionar',
          'reportes:module', 'reportes:ver'
        ].map(name => ({ permissionId: byName[name] }))
      }
    }
  });

  // — Comprador
  await prisma.role.upsert({
    where: { name: 'Comprador' },
    update: {},
    create: {
      name: 'Comprador',
      description: 'Gestiona órdenes de compra y proveedores',
      isSystem: false,
      permissions: {
        create: [
          'proveedores:module', 'proveedores:ver', 'proveedores:gestionar',
          'ordenes_compra:module', 'ordenes_compra:ver', 'ordenes_compra:crear',
          'articulos:module', 'articulos:ver',
          'reportes:module', 'reportes:ver'
        ].map(name => ({ permissionId: byName[name] }))
      }
    }
  });

  // — Vendedor
  await prisma.role.upsert({
    where: { name: 'Vendedor' },
    update: {},
    create: {
      name: 'Vendedor',
      description: 'Atención a clientes y ventas',
      isSystem: false,
      permissions: {
        create: [
          'clientes:module', 'clientes:ver', 'clientes:gestionar',
          'articulos:module', 'articulos:ver',
          'skids:module', 'skids:ver',
          'reportes:module', 'reportes:ver'
        ].map(name => ({ permissionId: byName[name] }))
      }
    }
  });

  // — Operario
  await prisma.role.upsert({
    where: { name: 'Operario' },
    update: {},
    create: {
      name: 'Operario',
      description: 'Ejecuta órdenes de trabajo',
      isSystem: false,
      permissions: {
        create: [
          'ordenes_trabajo:module', 'ordenes_trabajo:ver', 'ordenes_trabajo:ejecutar',
          'skids:module', 'skids:ver',
          'componentes:module', 'componentes:ver',
          'movimientos:module', 'movimientos:registrar'
        ].map(name => ({ permissionId: byName[name] }))
      }
    }
  });

  // 4. Crear MenuItems vinculados a permisos “module” y secciones
  const menuItems = [
    { label: 'Dashboard',           route: '/',                            icon: 'pi pi-fw pi-home',                   order: 1,  key: 'dashboard:module',          section: 'Home' },
    { label: 'Movimientos',         route: 'gestion-articulos/movimientos',                icon: 'pi pi-fw pi-arrow-right-arrow-left', order: 2,  key: 'movimientos:module',        section: 'Gestión General' },
    { label: 'Stock',               route: '/gestion-articulos/stock',    icon: 'pi pi-fw pi-objects-column',         order: 3,  key: 'articulos:module',         section: 'Gestión General' },
    { label: 'Pedidos',             route: '/gestion-general/pedidos',    icon: 'pi pi-fw pi-clipboard',              order: 4,  key: 'ordenes_compra:module',     section: 'Gestión General' },
    { label: 'Artículos',           route: '/gestion-articulos/articulo', icon: 'pi pi-fw pi-box',                    order: 5,  key: 'articulos:module',         section: 'Gestión Entidades' },
    { label: 'Componentes',         route: '/gestion-recetas/receta',     icon: 'pi pi-fw pi-hammer',                 order: 6,  key: 'componentes:module',       section: 'Gestión Entidades' },
    { label: 'Skids',               route: '/gestion-skids/skid',          icon: 'pi pi-fw pi-th-large',               order: 7,  key: 'skids:module',             section: 'Gestión Entidades' },
    { label: 'Clientes',            route: '/gestion-clientes/cliente',    icon: 'pi pi-fw pi-id-card',                order: 8,  key: 'clientes:module',          section: 'Gestión Entidades' },
    { label: 'Yacimientos',         route: '/gestion-yacimientos/yacimiento', icon: 'pi pi-fw pi-map-marker',          order: 9,  key: 'ubicaciones:module',       section: 'Gestión Entidades' },
    { label: 'Proveedores',         route: '/gestion-proveedor/proveedor', icon: 'pi pi-fw pi-truck',                  order: 10, key: 'proveedores:module',       section: 'Gestión Entidades' },
    { label: 'Usuarios',            route: '/gestion-usuarios/users',      icon: 'pi pi-fw pi-user',                   order: 11, key: 'seguridad:module',         section: 'Seguridad' },
    { label: 'Roles y permisos',    route: '/gestion-roles-permisos/roles',icon: 'pi pi-fw pi-shield',                 order: 12, key: 'seguridad:module',         section: 'Seguridad' },
    { label: 'Reportes',            route: 'gestion-reportes/reportes',                    icon: 'pi pi-fw pi-chart-bar',              order: 13, key: 'reportes:module',         section: 'Reportes' },
  ];

  for (const item of menuItems) {
    const permId = byName[item.key];
    await prisma.menuItem.upsert({
      where: { route: item.route },
      update: {
        label:        item.label,
        icon:         item.icon,
        order:        item.order,
        section:      item.section,
        permissionId: permId,
      },
      create: {
        label:        item.label,
        route:        item.route,
        icon:         item.icon,
        order:        item.order,
        section:      item.section,
        permissionId: permId,
      }
    });
  }

  console.log('🚀 Seed completado exitosamente!');
}

main()
  .catch(e => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });