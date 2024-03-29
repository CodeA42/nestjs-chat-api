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
import { UserService } from 'src/user/user.service';

Injectable();
export class AuthenticationService {
  constructor(
    @InjectRepository(Token) private tokensRepository: Repository<Token>,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async register(userAuthDto: UserAuthDto): Promise<{ username: string }> {
    try {
      await this.userService.selectByEmail(userAuthDto.email);
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
      await this.userService.selectByUsername(userAuthDto.username);
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
    return { username: user.username };
  }

  async login(
    userAuthDto: UserAuthDto,
    userAgent: string,
  ): Promise<[accessToken: string, refreshToken: string]> {
    let user: User;
    try {
      if (userAuthDto.email) {
        user = await this.userService.selectByEmail(userAuthDto.email);
      }
      if (userAuthDto.username) {
        user = await this.userService.selectByUsername(userAuthDto.username);
      }
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new WrongCredentialsException();
      }
      console.error(e);
      throw new InternalServerErrorException();
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
    return await this.userService.insertUser(
      userAuthDto.username,
      hashedPassword,
      userAuthDto.email,
    );
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
