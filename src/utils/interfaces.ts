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

export interface HttpResponse {
  message: string;
  data?: unknown;
}
