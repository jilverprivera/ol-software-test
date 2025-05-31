import { Module } from '@nestjs/common';

import { EstablishmentController } from './establishment.controller';

@Module({
  controllers: [EstablishmentController],
})
export class EstablishmentModule {}
