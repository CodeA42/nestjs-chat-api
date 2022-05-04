import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthDto } from './dto/userAuthDto';
import User from './entities/user.entity';
import * as bcrypt from 'bcrypt';

Injectable();
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async register(userAuthDto: UserAuthDto) {
    debugger;
    try {
      await this.selectByEmail(userAuthDto.email);
      throw new HttpException('Email Exists', HttpStatus.CONFLICT);
    } catch (e) {
      if (e instanceof NotFoundException) {
      } else if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new HttpException(
          'Server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    try {
      await this.selectByUsername(userAuthDto.username);
      throw new HttpException('Username exists', HttpStatus.CONFLICT);
    } catch (e) {
      if (e instanceof NotFoundException) {
      } else if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new HttpException(
          'Server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    const user: User = await this.hashPaswordAndInsertUser(userAuthDto);
    return user.id;
  }

  async login(userAuthDto: UserAuthDto) {
    let user: User;
    try {
      if (userAuthDto.email) {
        user = await this.selectByEmail(userAuthDto.username);
      }
      if (userAuthDto.username) {
        user = await this.selectByUsername(userAuthDto.username);
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new HttpException('Wrong credentials', HttpStatus.CONFLICT);
      }
    }

    console.log(user);

    throw new Error('Method not implemented.');
  }

  refresh() {
    throw new Error('Method not implemented.');
  }

  logout() {
    throw new Error('Method not implemented.');
  }

  private async hashPaswordAndInsertUser(userAuthDto: UserAuthDto) {
    const hashedPassword = await bcrypt.hash(
      userAuthDto.password,
      Number(this.configService.get<number>('saltRounds')),
    );
    return await this.insertUser(
      userAuthDto.username,
      hashedPassword,
      userAuthDto.email,
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