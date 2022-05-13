import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Token from '../entities/Token.entity';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Token]), ConfigModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
