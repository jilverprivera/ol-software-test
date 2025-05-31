import { Controller, Get } from '@nestjs/common';

@Controller('/api/establishments')
export class EstablishmentController {
  @Get('/establishments')
  getAllEstablishments() {
    return 'Establishments';
  }
}
