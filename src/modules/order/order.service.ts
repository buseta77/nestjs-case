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
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNewOrder(createOrderDto: CreateOrderDto, userId: number) {
    // check if user with given id exists
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if user balance is enough to place this order
    if (user.balance < createOrderDto.price) {
      throw new HttpException('Insufficient balance', HttpStatus.BAD_REQUEST);
    }

    // save order to database
    const newOrder = this.orderRepository.create({ ...createOrderDto, userId });
    await this.orderRepository.save(newOrder);

    // modify user balance
    const newBalance = user.balance - createOrderDto.price;
    await this.userRepository.update({ id: userId }, { balance: newBalance });

    return {
      message: 'Order successfully placed',
      data: { orderId: newOrder.id },
    };
  }

  async getUserOrders(userId: number) {
    // check user with given id exists
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user || !userId) {
      throw new NotFoundException('User not found');
    }

    // get user orders as array
    const userOrders = await this.orderRepository.findBy({ userId });

    return userOrders;
  }
}
