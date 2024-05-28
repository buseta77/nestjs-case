import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { HttpResponse } from './user.interface';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<HttpResponse> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    await this.userRepository.save(newUser);

    return {
      message: 'User successfully created',
      data: { userId: newUser.id },
    };
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<HttpResponse> {
    const user = await this.userRepository.findOneBy({
      email: loginUserDto.email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const { id, email } = user;
    const jwtToken = this.authService.createToken({ id, email });

    return {
      message: 'Login successful',
      data: { access_token: jwtToken },
    };
  }
}
