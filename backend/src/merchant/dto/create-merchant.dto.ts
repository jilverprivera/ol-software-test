/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { Status } from '@prisma/client';

export class CreateMerchantDto {
  @IsString()
  name: string;

  @IsString()
  municipality: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsDateString()
  registrationDate: string;

  @IsEnum(Status)
  status: Status;
}
