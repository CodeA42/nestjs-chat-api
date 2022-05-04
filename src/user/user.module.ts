import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Token from './entities/Token.entity';
import User from './entities/User.entity';
import { RefreshTokenValidator } from './middlewares/refreshTokenValidator.middleware';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), ConfigModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RefreshTokenValidator)
      .forRoutes({ path: 'refresh', method: RequestMethod.GET });
  }
}
