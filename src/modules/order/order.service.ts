import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { CreateOrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private userRepository: Repository<User>,
  ) {}

  async createNewOrder(createOrderDto: CreateOrderDto, userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.balance < createOrderDto.price) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    const newOrder = this.orderRepository.create({ ...createOrderDto, userId });
    await this.orderRepository.save(newOrder);

    return {
      message: 'Order successfully placed',
      data: { orderId: newOrder.id },
    };
  }
}
