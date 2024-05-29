import {
  Controller,
  Body,
  Post,
  Get,
  UsePipes,
  UseGuards,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { HttpResponse, OrderData } from '../../utils/interfaces';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { CreateOrderDto } from './order.dto';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: { userId: number };
}

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  createUser(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: AuthRequest,
  ): Promise<HttpResponse> {
    const userId = req.user.userId;
    return this.orderService.createNewOrder(createOrderDto, userId);
  }

  @Get('getAll')
  @UseGuards(AuthGuard('jwt'))
  getOrders(@Req() req: AuthRequest): Promise<OrderData[]> {
    const userId = req.user.userId;
    return this.orderService.getUserOrders(userId);
  }
}
