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
import { AuthTypes } from 'src/types/AuthTypes';
import { DecodedToken } from 'src/types/types';

export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authenticationType = this.reflector.get<string>(
      'authentication',
      context.getHandler(),
    );

    if (authenticationType === AuthTypes.REFRESH) {
      const req: Request = context.switchToHttp().getRequest();
      const res: Response = context.switchToHttp().getResponse();
      const refreshToken = req.cookies?.[AuthTypes.REFRESH];

      const isAuthenticated = await verify(
        refreshToken,
        this.configService.get(AuthTypes.REFRESH_SECRET),
        (err: Error, decoded: DecodedToken): boolean => {
          if (err) {
            throw new UnauthorizedException();
          }

          res.locals.user = decoded.user;
          return true;
        },
      );

      return isAuthenticated;
    }
  }
}
