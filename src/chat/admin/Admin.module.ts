import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from 'src/entities/Chat.entity';
import { AdminController } from './Admin.controller';
import { AdminService } from './Admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), ConfigModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
