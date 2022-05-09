import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Chat from 'src/entities/Chat.entity';
import { AdminController } from './Admin.controller';
import { AdminService } from './Admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
