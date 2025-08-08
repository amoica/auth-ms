import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { PermissionModule } from './permission/permission.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, RolesModule, PermissionModule, MenuModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
