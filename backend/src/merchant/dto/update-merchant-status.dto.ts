/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateMerchantStatusDto {
  @IsEnum(Status)
  status: Status;
}
