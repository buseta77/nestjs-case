import { IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  productName: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  price: number;
}
