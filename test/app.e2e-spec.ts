import * as dotenv from 'dotenv';
dotenv.config();

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './../src/modules/user/user.entity';
import { Order } from './../src/modules/order/order.entity';
import { faker } from '@faker-js/faker';

function generateRandomUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 4 }),
  };
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let userId: number;

  const randomUser = generateRandomUser();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db.sqlite',
          migrations: ['dist/db/migrations/*.js'],
          entities: [User, Order],
          synchronize: false,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new user with default balance = 100', async () => {
    const signupRequest = await request(app.getHttpServer())
      .post('/user/signup')
      .send(randomUser)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toEqual('User successfully created');
      });
    userId = signupRequest.body.data.userId;
    return signupRequest;
  }, 1000);

  it('should login a valid user', async () => {
    const loginRequest = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: randomUser.email,
        password: randomUser.password,
      })
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.message).toEqual('Login successful');
        expect(res.body.data).toHaveProperty('token');
      });
    token = loginRequest.body.data.token;
    return loginRequest;
  }, 1000);

  it('should place an order if sufficient balance', async () => {
    return request(app.getHttpServer())
      .post('/order/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productName: 'exampleProduct',
        quantity: 1,
        price: 40,
        userId,
      })
      .expect(HttpStatus.CREATED)
      .expect((res) => {
        expect(res.body.message).toEqual('Order successfully placed');
      });
  }, 1000);

  it('should have a new balance of 60 after placing order', async () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body.balance).toEqual(60);
      });
  }, 1000);

  it('shouldnt place an order if not sufficient balance', async () => {
    return request(app.getHttpServer())
      .post('/order/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        productName: 'expensiveProduct',
        quantity: 2,
        price: 70,
        userId,
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toEqual('Insufficient balance');
      });
  }, 1000);

  it('should have an order list of length 1', async () => {
    return request(app.getHttpServer())
      .get('/order/getAll')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .expect((res) => {
        expect(res.body).toHaveLength(1);
      });
  }, 1000);
});
