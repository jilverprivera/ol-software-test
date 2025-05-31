/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { Role } from '@prisma/client';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { UpdateMerchantStatusDto } from './dto/update-merchant-status.dto';
import { CustomRequest } from '../auth/interfaces/request.interface';

describe('MerchantController', () => {
  let controller: MerchantController;
  let merchantService: MerchantService;

  const mockMerchantService = {
    findAll: jest.fn(),
    getCities: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
    generateCsvData: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantController],
      providers: [
        {
          provide: MerchantService,
          useValue: mockMerchantService,
        },
      ],
    }).compile();

    controller = module.get<MerchantController>(MerchantController);
    merchantService = module.get<MerchantService>(MerchantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all merchants with pagination', async (): Promise<void> => {
      const mockResult = {
        data: [{ id: 1, name: 'Merchant 1' }],
        meta: { total: 1, page: 1, limit: 10 },
      };
      mockMerchantService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll({});

      expect(merchantService.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockResult.data,
        meta: mockResult.meta,
      });
    });
  });

  describe('getCities', () => {
    it('should return all municipalities', async (): Promise<void> => {
      const mockMunicipalities = ['Municipality 1', 'Municipality 2'];
      mockMerchantService.getCities.mockResolvedValue(mockMunicipalities);

      const result = await controller.getCities();

      expect(merchantService.getCities).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockMunicipalities,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single merchant', async (): Promise<void> => {
      const mockMerchant = { id: 1, name: 'Merchant 1' };
      mockMerchantService.findOne.mockResolvedValue(mockMerchant);

      const result = await controller.findOne('1');

      expect(merchantService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        data: { merchant: mockMerchant },
      });
    });
  });

  describe('create', () => {
    it('should create a new merchant', async (): Promise<void> => {
      const createDto: CreateMerchantDto = {
        name: 'New Merchant',
        municipality: 'Test Municipality',
        registrationDate: new Date().toISOString(),
        status: 'ACTIVE',
      };
      const mockMerchant = { id: 1, ...createDto };
      const mockRequest = {
        user: { id: 1 },
      } as CustomRequest;

      mockMerchantService.create.mockResolvedValue(mockMerchant);

      const result = await controller.create(createDto, mockRequest);

      expect(merchantService.create).toHaveBeenCalledWith(createDto, mockRequest.user.id);
      expect(result).toEqual({
        data: mockMerchant,
      });
    });
  });

  describe('update', () => {
    it('should update a merchant', async (): Promise<void> => {
      const updateDto: UpdateMerchantDto = {
        name: 'Updated Merchant',
        municipality: 'Updated Municipality',
      };
      const mockMerchant = { id: 1, ...updateDto };
      const mockRequest = {
        user: { id: 1 },
      } as CustomRequest;

      mockMerchantService.update.mockResolvedValue(mockMerchant);

      const result = await controller.update('1', updateDto, mockRequest);

      expect(merchantService.update).toHaveBeenCalledWith(1, updateDto, mockRequest.user.id);
      expect(result).toEqual({
        data: { merchant: mockMerchant },
      });
    });
  });

  describe('updateStatus', () => {
    it('should update merchant status', async (): Promise<void> => {
      const statusDto: UpdateMerchantStatusDto = { status: 'ACTIVE' };
      const mockMerchant = { id: 1, status: 'ACTIVE' };
      const mockRequest = {
        user: { id: 1 },
      } as CustomRequest;

      mockMerchantService.updateStatus.mockResolvedValue(mockMerchant);

      const result = await controller.updateStatus('1', statusDto, mockRequest);

      expect(merchantService.updateStatus).toHaveBeenCalledWith(1, statusDto, mockRequest.user.id);
      expect(result).toEqual({
        data: { merchant: mockMerchant },
      });
    });
  });

  describe('remove', () => {
    it('should remove a merchant', async (): Promise<void> => {
      const mockRequest = {
        user: { role: Role.ADMINISTRATOR, id: 1 },
      } as CustomRequest;
      const mockResult = { success: true };

      mockMerchantService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove('1', mockRequest);

      expect(merchantService.remove).toHaveBeenCalledWith(1, mockRequest.user.id);
      expect(result).toEqual(mockResult);
    });
  });

  describe('exportCsv', () => {
    it('should export merchants as CSV', async (): Promise<void> => {
      const mockCsvData = 'id,name\n1,Merchant 1';
      const mockRequest = {
        user: { id: 1 },
      } as CustomRequest;

      mockMerchantService.generateCsvData.mockResolvedValue(mockCsvData);

      const result = await controller.exportCsv(mockRequest);

      expect(merchantService.generateCsvData).toHaveBeenCalledWith(mockRequest.user.id);
      expect(result).toEqual(mockCsvData);
    });
  });
});
