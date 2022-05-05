import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Token from '../entities/Token.entity';
import User from '../entities/User.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Token]), ConfigModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
