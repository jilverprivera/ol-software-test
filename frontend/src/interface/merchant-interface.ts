export interface IMerchant {
  id: number;
  name: string;
  municipality: string;
  phone: string;
  email: string;
  status: string;
  registeredById: number;
  registrationDate: Date;
  updatedById: number;
  updatedAt: Date;
  createdAt: Date;
  registeredBy: IMerchantUser;
  updatedBy: IMerchantUser;
  establishments: IEstablishment[];
}

interface IMerchantUser {
  name: string;
  email: string;
}
export interface IEstablishment {
  name: string;
  revenue: string;
  employeeCount: number;
}
