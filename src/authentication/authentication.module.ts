import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entities/User.entity';
import { UserService } from 'src/user/user.service';
import Token from '../entities/Token.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token, User]), ConfigModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
