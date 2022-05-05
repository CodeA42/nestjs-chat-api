import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { JwtPayload } from 'src/@types';
import { AuthTypes } from 'src/@types/AuthTypes';

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
      const refreshToken = req.cookies?.[AuthTypes.REFRESH];
      const isAuthenticated = false;

      try {
        const data = verify(
          refreshToken,
          this.configService.get(AuthTypes.REFRESH_SECRET),
        ) as JwtPayload;
        //if(Math.floor(Date.now() / 1000) > decoded.exp){
        if (Math.floor(Date.now() / 1000) > data.exp) {
          // await
        }
        req.user = data.user;
      } catch (e) {
        console.error(e);
      }

      return isAuthenticated;
    }
  }
}
