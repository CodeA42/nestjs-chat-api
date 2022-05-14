import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../entities/User.entity';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
