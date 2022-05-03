import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import User from './entities/user.entity';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  register(userDto: CreateUserDto) {
    return 'here';
  }

  // login() {}

  // refresh() {}

  // logout() {}
}
