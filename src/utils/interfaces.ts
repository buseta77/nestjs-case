import { Request } from 'express';
export interface UseDataJWT {
  id: number;
  email: string;
}

export interface OrderData {
  id: number;
  productName: string;
  quantity: number;
  price: number;
  isCompleted: boolean;
  userId: number;
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
}

export interface HttpResponse {
  message: string;
  data?: unknown;
}

export interface AuthRequest extends Request {
  user: { userId: number };
}
