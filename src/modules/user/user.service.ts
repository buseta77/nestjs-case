import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, LoginUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { HttpResponse } from '../../utils/interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<HttpResponse> {
    // check if user with this email already exists
    const user = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (user) {
      throw new HttpException('Email already exists', 400);
    }

    // hash password
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    // save user to database
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
    // check if user with this email exists
    const user = await this.userRepository.findOneBy({
      email: loginUserDto.email,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // check if passwords match
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    // create jwt token
    const { id, email } = user;
    const jwtToken = this.authService.createToken({ id, email });

    return {
      message: 'Login successful',
      data: { token: jwtToken },
    };
  }

  async getUser(userId: number) {
    // get user info from database
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user || !userId) {
      throw new NotFoundException('User not found');
    }

    // remove password from response
    delete user.password;

    return user;
  }
}
