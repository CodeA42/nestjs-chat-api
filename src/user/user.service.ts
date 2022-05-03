import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import User from './entities/user.entity';
import * as bcrypt from 'bcrypt';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async register(userDto: CreateUserDto) {
    try {
      await this.selectByEmail(userDto.email);
      throw new HttpException('Email Exists', HttpStatus.CONFLICT);
    } catch (e) {}

    try {
      await this.selectByUsername(userDto.username);
      throw new HttpException('Username exists', HttpStatus.CONFLICT);
    } catch (e) {}

    const user = await this.hashPaswordAndInsertUser(userDto);
    return user.id;
  }

  // login() {}

  // refresh() {}

  // logout() {}

  private async hashPaswordAndInsertUser(userDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      userDto.password,
      Number(this.configService.get<number>('saltRounds')),
    );
    return await this.insertUser(
      userDto.username,
      hashedPassword,
      userDto.email,
    );
  }

  private async insertUser(username: string, password: string, email: string) {
    const user = new User();
    user.username = username;
    user.password = password;
    user.email = email;

    return await this.usersRepository.save(user);
  }

  private async selectByEmail(email: string): Promise<User | null> {
    try {
      const user: User = await this.usersRepository.findOne({
        where: {
          email,
        },
      });
      if (user) return user;
    } catch (e) {
      console.log(e);
      return null;
    }
    throw new NotFoundException();
  }

  private async selectByUsername(username: string): Promise<User | null> {
    try {
      const user: User = await this.usersRepository.findOne({
        where: {
          username,
        },
      });
      if (user) return user;
    } catch (e) {
      console.log(e);
      return null;
    }
    throw new NotFoundException();
  }
}
