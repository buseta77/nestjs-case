import {
  Controller,
  Body,
  Post,
  Get,
  HttpCode,
  UsePipes,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { AuthRequest, HttpResponse, UserData } from '../../utils/interfaces';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  createUser(@Body() createUserDto: CreateUserDto): Promise<HttpResponse> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  loginUser(@Body() loginUserDto: LoginUserDto): Promise<HttpResponse> {
    return this.userService.loginUser(loginUserDto);
  }

  @Get('/')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  getUser(@Req() req: AuthRequest): Promise<UserData> {
    const userId = req.user.userId;
    return this.userService.getUser(userId);
  }
}
