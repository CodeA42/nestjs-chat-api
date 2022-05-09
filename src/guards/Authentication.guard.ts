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

    if (authenticationType === AuthTypes.REFRESH) {
      const req: Request = context.switchToHttp().getRequest();
      const res: Response = context.switchToHttp().getResponse();
      const refreshToken = req.cookies?.[AuthTypes.REFRESH];

      try {
        const data = verify(
          refreshToken,
          this.configService.get(AuthTypes.REFRESH_SECRET),
        ) as JwtPayload;

        if (Math.floor(Date.now() / 1000) >= data.exp) {
          await this.authenticationService.deleteToken(refreshToken);
          res.clearCookie(AuthTypes.REFRESH);
          throw new SessionExpiredException();
        } else {
          req.user = data.user;
          isAuthenticated = true;
        }
      } catch (e) {
        if (e instanceof SessionExpiredException) {
          throw e;
        }
        throw new UnauthorizedException();
      }
    }

    if (authenticationType === AuthTypes.ACCESS) {
      const req: Request = context.switchToHttp().getRequest();

      const authHeader = req.headers['authorization'];
      const accessToken = authHeader && authHeader.split(' ')[1];

      try {
        const data = verify(
          accessToken,
          this.configService.get<string>(AuthTypes.ACCESS_SECRET),
        ) as JwtPayload;

        if (Math.floor(Date.now() / 1000) >= data.exp) {
          throw new SessionExpiredException();
        } else {
          req.user = data.user;
          isAuthenticated = true;
        }
      } catch (e) {
        if (e instanceof SessionExpiredException) {
          throw e;
        }
        throw new UnauthorizedException();
      }
    }

    return isAuthenticated;
  }
}
