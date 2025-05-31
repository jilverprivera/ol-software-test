import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req, Header } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { QueryMerchantDto } from './dto/query-merchant.dto';
import { UpdateMerchantStatusDto } from './dto/update-merchant-status.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CustomRequest } from '../auth/interfaces/request.interface';

@Controller('/api/merchants')
@UseGuards(JwtAuthGuard)
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('/')
  async findAll(@Query() query: QueryMerchantDto) {
    const merchants = await this.merchantService.findAll(query);
    return {
      data: merchants.data,
      meta: merchants.meta,
    };
  }

  @Get('/cities')
  async getCities() {
    const cities = await this.merchantService.getCities();
    return {
      data: cities,
    };
  }

  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const merchant = await this.merchantService.findOne(+id);
    return {
      data: { merchant },
    };
  }

  @Post()
  async create(@Body() createMerchantDto: CreateMerchantDto, @Req() req: CustomRequest) {
    const merchant = await this.merchantService.create(createMerchantDto, req.user.id);
    return {
      data: merchant,
    };
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto, @Req() req: CustomRequest) {
    const merchant = await this.merchantService.update(+id, updateMerchantDto, req.user.id);
    return {
      data: { merchant },
    };
  }

  @Patch('/:id/status')
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateMerchantStatusDto, @Req() req: CustomRequest) {
    const merchant = await this.merchantService.updateStatus(+id, updateStatusDto, req.user.id);
    return {
      data: { merchant },
    };
  }

  @Delete('/:id')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMINISTRATOR)
  async remove(@Param('id') id: string, @Req() req: CustomRequest) {
    const result = await this.merchantService.remove(+id, req.user.id);
    return {
      ...result,
    };
  }

  @Get('/export/csv')
  @UseGuards(RoleGuard)
  @Roles(Role.ADMINISTRATOR)
  @Header('Content-Type', 'text/tab-separated-values; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename=merchants.tsv')
  async exportCsv(@Req() req: CustomRequest) {
    const csvData = await this.merchantService.generateCsvData(req.user.id);
    return csvData;
  }
}
