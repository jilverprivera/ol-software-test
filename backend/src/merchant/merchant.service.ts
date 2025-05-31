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

  async getCities(): Promise<string[]> {
    const cachedCities = await this.cacheManager.get<string[]>('cities');
    if (cachedCities) return cachedCities;

    const merchants = await this.prisma.merchant.findMany({
      select: { municipality: true },
      distinct: ['municipality'],
      where: { status: 'ACTIVE' },
    });

    const cities = merchants.map((merchant) => merchant.municipality);
    await this.cacheManager.set('cities', cities, 3600000);
    return cities;
  }

  async findAll(query: QueryMerchantDto) {
    const { page = 1, limit = 5, name, registrationDate, status } = query;
    const skip = (page - 1) * Number(limit);

    const where: Prisma.MerchantWhereInput = {
      ...(name && { name: { contains: name, mode: Prisma.QueryMode.insensitive } }),
      ...(registrationDate && { registrationDate }),
      ...(status && { status }),
    };

    const [merchants, total] = await Promise.all([
      this.prisma.merchant.findMany({
        where,
        skip,
        take: Number(limit),
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
    });

    if (!merchant) {
      throw new NotFoundException(`Merchant with ID ${id} not found`);
    }

    return merchant;
  }

  async create(createMerchantDto: CreateMerchantDto, userId: number) {
    const merchant = await this.prisma.merchant.create({
      data: {
        name: createMerchantDto.name,
        email: createMerchantDto.email,
        municipality: createMerchantDto.municipality,
        phone: createMerchantDto.phone,
        registrationDate: new Date(createMerchantDto.registrationDate),
        status: createMerchantDto.status,
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
    if (createMerchantDto.employeeCount !== null && createMerchantDto.revenue !== null) {
      await this.prisma.establishment.create({
        data: {
          name: `Establishment ${merchant.name}`,
          revenue: Number(createMerchantDto.revenue),
          employeeCount: Number(createMerchantDto.employeeCount),
          ownerId: merchant.id,
          registeredById: userId,
          updatedById: userId,
        },
      });
    }

    await this.cacheManager.del('merchants');
    return merchant;
  }

  async update(id: number, updateMerchantDto: UpdateMerchantDto, userId: number) {
    const merchant = await this.findOne(id);

    const updatedMerchant = await this.prisma.merchant.update({
      where: { id },
      data: {
        name: updateMerchantDto.name,
        municipality: updateMerchantDto.municipality,
        phone: updateMerchantDto.phone,
        email: updateMerchantDto.email,
        status: updateMerchantDto.status,
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

    const establishmentData = {
      employeeCount: updateMerchantDto.employeeCount !== null ? Number(updateMerchantDto.employeeCount) : 0,
      revenue: updateMerchantDto.revenue !== null ? Number(updateMerchantDto.revenue) : 0,
    };
    if (merchant.establishments.length === 0) {
      if (establishmentData.employeeCount > 0 && establishmentData.revenue > 0) {
        await this.prisma.establishment.create({
          data: {
            ...establishmentData,
            name: `Establishment ${merchant.name}`,
            ownerId: merchant.id,
            registeredById: userId,
            updatedById: userId,
          },
        });
      }
    } else {
      await this.prisma.establishment.updateMany({
        where: { ownerId: id },
        data: establishmentData,
      });
    }

    await this.cacheManager.del('merchants');
    return updatedMerchant;
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

    await this.cacheManager.del('merchants');
    return merchant;
  }

  async remove(id: number, userId: number) {
    await this.findOne(id);
    const userDB = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userDB || userDB.role !== Role.ADMINISTRATOR) {
      throw new ForbiddenException('Only administrators can delete merchants');
    }
    await this.prisma.establishment.deleteMany({ where: { ownerId: id } });
    await this.prisma.merchant.delete({ where: { id } });
    await this.cacheManager.del('merchants');

    return { message: 'Merchant deleted successfully' };
  }

  async generateCsvData(userId: number) {
    const userDB = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userDB || userDB.role !== Role.ADMINISTRATOR) {
      throw new ForbiddenException('Only administrators can export merchants');
    }

    const merchants = await this.prisma.merchant.findMany({
      include: {
        establishments: {
          select: {
            revenue: true,
            employeeCount: true,
          },
        },
      },
    });

    const BOM = '\ufeff';
    const headers = [
      'Nombre o razón social',
      'Municipio',
      'Teléfono',
      'Correo Electrónico',
      'Fecha de Registro',
      'Estado',
      'Cantidad de Establecimientos',
      'Total Ingresos',
      'Cantidad de Empleados',
    ];

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(num);
    };

    const rows = merchants.map((merchant) => {
      const establishmentCount = merchant.establishments.length;
      const totalRevenue = merchant.establishments.reduce((sum, est) => sum + Number(est.revenue), 0);
      const totalEmployees = merchant.establishments.reduce((sum, est) => sum + est.employeeCount, 0);

      const row = [
        merchant.name,
        merchant.municipality,
        merchant.phone || '',
        merchant.email || '',
        merchant.registrationDate.toISOString().split('T')[0],
        merchant.status === 'ACTIVE' ? 'Activo' : 'Inactivo',
        establishmentCount.toString(),
        formatNumber(totalRevenue),
        totalEmployees.toString(),
      ];

      return row.join('\t');
    });

    return BOM + [headers.join('\t'), ...rows].join('\r\n');
  }
}
