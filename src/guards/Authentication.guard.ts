import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'src/@types';
import { AuthTypes } from 'src/@types/AuthTypes';
import { AuthenticationService } from 'src/authentication/authentication.service';
import SessionExpiredException from 'src/exceptions/SessionExpiredException';

export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(AuthenticationService)
    private readonly authenticationService: AuthenticationService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticationType = this.reflector.get<string>(
      'authentication',
      context.getHandler(),
    );

    let isAuthenticated = false;

    const req: Request = context.switchToHttp().getRequest();
    const res: Response = context.switchToHttp().getResponse();

    const isRefreshToken = authenticationType === AuthTypes.REFRESH;

    try {
      let secret: string;
      let token: string;

      if (isRefreshToken) {
        secret = AuthTypes.REFRESH_SECRET;
        token = req.cookies?.[AuthTypes.REFRESH];
      } else {
        secret = AuthTypes.ACCESS_SECRET;
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
      }

      const data = verify(token, this.configService.get(secret)) as JwtPayload;

      if (!this.isValidToken) {
        if (isRefreshToken) {
          await this.authenticationService.deleteToken(token);
          res.clearCookie(AuthTypes.REFRESH);
        }
        throw new SessionExpiredException();
      }

      req.user = data.user;
      isAuthenticated = true;
    } catch (e) {
      if (e instanceof SessionExpiredException) {
        throw e;
      }
      console.error(e);
      throw new UnauthorizedException();
    }

    return isAuthenticated;
  }

  isValidToken(data: JwtPayload): boolean {
    return data.exp >= Math.floor(Date.now() / 1000);
  }
}
