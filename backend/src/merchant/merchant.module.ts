import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [CacheModule.register({ ttl: 3600000, max: 100 }), PrismaModule],
  controllers: [MerchantController],
  providers: [MerchantService],
})
export class MerchantModule {}
