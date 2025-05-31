import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MerchantModule } from './merchant/merchant.module';

import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, MerchantModule, PrismaModule],
})
export class AppModule {}
