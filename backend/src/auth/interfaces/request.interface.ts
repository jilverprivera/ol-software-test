import { Request } from 'express';
import { RequestUser } from './request-user.interface';

export interface CustomRequest extends Request {
  user: RequestUser;
}
