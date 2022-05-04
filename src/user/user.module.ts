import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Token from './entities/Token.entity';
import User from './entities/User.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), ConfigModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
