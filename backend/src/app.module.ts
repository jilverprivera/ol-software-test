import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { MerchantModule } from './merchant/merchant.module';
import { EstablishmentModule } from './establishment/establishment.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, MerchantModule, EstablishmentModule, PrismaModule],
})
export class AppModule {}
