import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAuthDto } from '../dto/UserAuthDto';
import User from '../entities/User.entity';
import * as bcrypt from 'bcrypt';
import { decode, Secret, sign } from 'jsonwebtoken';
import Token from '../entities/Token.entity';
import EmailExistsException from '../exceptions/EmailExistsException';
import UsernameExistsException from '../exceptions/UsernameExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import { AuthTypes } from 'src/@types/AuthTypes';
import { TokenUser } from 'src/@types';
import { TokenUserDto } from 'src/dto/TokenUserDto';

Injectable();
export class AuthenticationService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Token) private tokensRepository: Repository<Token>,
    private configService: ConfigService,
  ) {}

  async register(userAuthDto: UserAuthDto): Promise<{ id: string }> {
    try {
      await this.selectByEmail(userAuthDto.email);
      throw new EmailExistsException();
    } catch (e) {
      if (e instanceof NotFoundException) {
      } else if (e instanceof EmailExistsException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException();
      }
    }

    try {
      await this.selectByUsername(userAuthDto.username);
      throw new UsernameExistsException();
    } catch (e) {
      if (e instanceof NotFoundException) {
      } else if (e instanceof UsernameExistsException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException();
      }
    }

    const user: User = await this.hashPaswordAndInsertUser(userAuthDto);
    return { id: user.id };
  }

  async login(
    userAuthDto: UserAuthDto,
    userAgent: string,
  ): Promise<[accessToken: string, refreshToken: string]> {
    let user: User;
    try {
      if (userAuthDto.email) {
        user = await this.selectByEmail(userAuthDto.email);
      }
      if (userAuthDto.username) {
        user = await this.selectByUsername(userAuthDto.username);
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new WrongCredentialsException();
      }
    }

    const tokenData: TokenUserDto = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    if (await bcrypt.compare(userAuthDto.password, user.password)) {
      const accessToken: string = this.generateAccessToken(tokenData);

      const refreshToken: string = this.generateRefreshToken(tokenData);

      try {
        const exp: number = this.getTokenExp(refreshToken);
        await this.insertToken(refreshToken, exp, user.username, userAgent);

        return [accessToken, refreshToken];
      } catch (e) {
        console.error(e);
        throw new InternalServerErrorException();
      }
    }
  }

  private async insertToken(
    token: string,
    exp: number,
    username: string,
    userAgent: string,
  ) {
    const tokenEntity = new Token();
    tokenEntity.token = token;
    tokenEntity.exp = exp;
    tokenEntity.username = username;
    tokenEntity.userAgent = userAgent;

    await this.tokensRepository.save(tokenEntity);
  }

  private getTokenExp(token: string): number {
    const decoded: any = decode(token);
    return decoded.exp;
  }

  private generateToken(
    user: TokenUserDto,
    key: Secret,
    expiresIn: string = this.configService.get(AuthTypes.ACCESS_DURATION),
  ): string {
    return sign({ user }, key, { expiresIn: expiresIn });
  }

  private generateAccessToken(user: TokenUser): string {
    return this.generateToken(
      user,
      this.configService.get(AuthTypes.ACCESS_SECRET),
      this.configService.get(AuthTypes.ACCESS_DURATION),
    );
  }

  private generateRefreshToken(user: TokenUser): string {
    return this.generateToken(
      user,
      this.configService.get(AuthTypes.REFRESH_SECRET),
      this.configService.get(AuthTypes.REFRESH_DURATION),
    );
  }

  refresh(user: TokenUserDto): { accessToken: string } {
    const accessToken = this.generateAccessToken(user);
    return { accessToken };
  }

  async logout(token: string): Promise<string> {
    try {
      await this.deleteToken(token);
      return 'Logged Out';
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException();
    }
  }

  private async hashPaswordAndInsertUser(userAuthDto: UserAuthDto) {
    const hashedPassword = await bcrypt.hash(
      userAuthDto.password,
      Number(this.configService.get<number>('SALT_ROUNDS')),
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

  async deleteToken(token: string) {
    //TODO: check if deleted and throw error if token is not found
    try {
      return await this.tokensRepository.delete({ token });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}
