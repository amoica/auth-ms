import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { MenuItemDto } from './dto/menu-item.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MenuService extends PrismaClient implements OnModuleInit {


    private readonly looger = new Logger('Menuservice');

    onModuleInit() {
        this.$connect()
            .then(() => this.looger.log('Prisma Client connected to the database'))
            .catch((error) => this.looger.error('Error connecting to the database', error));

        this.looger.log('MenuService initialized and conected to the database');
    }

    /** Devuelve los ítems de menú que el usuario puede ver según sus scopes */
    async getMenuForUser(scopes: string[]){
        const items = await this.menuItem.findMany({
            where: { permission: { name: { in: scopes } } },
            include: { permission: true },
            orderBy: { order: 'asc' },
        });

        return items.map(i => ({
            label: i.label,
            icon: i.icon,
            route: i.route,
            order: i.order,
            section: i.section,
        }));
    }
}
