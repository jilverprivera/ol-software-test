import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { QueryMerchantDto } from './dto/query-merchant.dto';
import { UpdateMerchantStatusDto } from './dto/update-merchant-status.dto';
import { Role, Prisma } from '@prisma/client';

@Injectable()
export class MerchantService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getMunicipalities(): Promise<string[]> {
    const cachedMunicipalities = await this.cacheManager.get<string[]>('municipalities');
    if (cachedMunicipalities) return cachedMunicipalities;

    const merchants = await this.prisma.merchant.findMany({
      select: { municipality: true },
      distinct: ['municipality'],
      where: { status: 'ACTIVE' },
    });

    const municipalities = merchants.map((merchant) => merchant.municipality);
    await this.cacheManager.set('municipalities', municipalities, 3600000);
    return municipalities;
  }

  async findAll(query: QueryMerchantDto) {
    const { page = 1, limit = 5, name, registrationDate, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MerchantWhereInput = {
      ...(name && { name: { contains: name, mode: Prisma.QueryMode.insensitive } }),
      ...(registrationDate && { registrationDate }),
      ...(status && { status }),
    };

    const [merchants, total] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        skip,
        take: limit,
        include: {
          registeredBy: {
            select: { name: true, email: true },
          },
          establishments: {
            select: {
              name: true,
              revenue: true,
              employeeCount: true,
            },
          },
          updatedBy: {
            select: { name: true, email: true },
          },
        },
      }),
      this.prisma.merchant.count({ where }),
    ]);

    return {
      data: merchants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const merchant = await this.prisma.merchant.findUnique({
      where: { id },
      include: {
        registeredBy: {
          select: { name: true, email: true },
        },
        updatedBy: {
          select: { name: true, email: true },
        },
      },
    });

    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }

    return merchant;
  }

  async create(createMerchantDto: CreateMerchantDto, userId: number) {
    const merchant = await this.prisma.merchant.create({
      data: {
        ...createMerchantDto,
        registeredById: userId,
        updatedById: userId,
      },
      include: {
        registeredBy: {
          select: { name: true, email: true },
        },
        updatedBy: {
          select: { name: true, email: true },
        },
      },
    });

    await this.cacheManager.del('municipalities');
    return merchant;
  }

  async update(id: number, updateMerchantDto: UpdateMerchantDto, userId: number) {
    await this.findOne(id);

    const merchant = await this.prisma.merchant.update({
      where: { id },
      data: {
        ...updateMerchantDto,
        updatedById: userId,
      },
      include: {
        registeredBy: {
          select: { name: true, email: true },
        },
        updatedBy: {
          select: { name: true, email: true },
        },
      },
    });

    await this.cacheManager.del('municipalities');
    return merchant;
  }

  async updateStatus(id: number, updateStatusDto: UpdateMerchantStatusDto, userId: number) {
    await this.findOne(id);

    const merchant = await this.prisma.merchant.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
        updatedById: userId,
      },
      include: {
        registeredBy: {
          select: { name: true, email: true },
        },
        updatedBy: {
          select: { name: true, email: true },
        },
      },
    });

    await this.cacheManager.del('municipalities');
    return merchant;
  }

  async remove(id: number, userRole: Role) {
    if (userRole !== Role.ADMINISTRATOR) {
      throw new ForbiddenException('Only administrators can delete merchants');
    }

    await this.findOne(id);
    await this.prisma.merchant.delete({ where: { id } });
    await this.cacheManager.del('municipalities');

    return { message: 'Merchant deleted successfully' };
  }

  async generateCsvData() {
    const merchants = await this.prisma.merchant.findMany({
      where: { status: 'ACTIVE' },
      include: {
        establishments: {
          select: {
            revenue: true,
            employeeCount: true,
          },
        },
      },
    });

    const header =
      'Nombre o razón social|Municipio|Teléfono|Correo Electrónico|Fecha de Registro|Estado|Cantidad de Establecimientos|Total Ingresos|Cantidad de Empleados';

    const rows = merchants.map((merchant) => {
      const establishmentCount = merchant.establishments.length;
      const totalRevenue = merchant.establishments.reduce((sum, est) => sum + Number(est.revenue), 0);
      const totalEmployees = merchant.establishments.reduce((sum, est) => sum + est.employeeCount, 0);

      return [
        merchant.name,
        merchant.municipality,
        merchant.phone || '',
        merchant.email || '',
        merchant.registrationDate.toISOString().split('T')[0],
        merchant.status,
        establishmentCount,
        totalRevenue.toFixed(2),
        totalEmployees,
      ].join('|');
    });

    return [header, ...rows].join('\n');
  }
}
