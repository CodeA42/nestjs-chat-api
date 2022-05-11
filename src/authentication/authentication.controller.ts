import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/validation/joi.validation';
import { UserAuthDto } from '../dto/UserAuthDto';
import createUserSchema from './validationSchemas/createUser.schema';
import { AuthenticationService } from './authentication.service';
import loginUserSchema from './validationSchemas/loginUser.schema';
import { Response } from 'express';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { AuthTypes } from 'src/@types/AuthTypes';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { Cookies } from 'src/decorators/Cookies.decorator';
import { User } from 'src/decorators/User.decorator';
import { TokenUserDto } from 'src/dto/TokenUserDto';

@Controller('')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  register(@Body() userAuthDto: UserAuthDto): Promise<{ id: string }> {
    return this.authenticationService.register(userAuthDto);
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async login(
    @Body() userAuthDto: UserAuthDto,
    @Headers() headers,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const [accessToken, refreshToken] = await this.authenticationService.login(
      userAuthDto,
      headers['user-agent'],
    );
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Get('refresh')
  @Authentication(AuthTypes.REFRESH)
  @UseGuards(AuthenticationGuard)
  refresh(@User() user: TokenUserDto): { accessToken: string } {
    return this.authenticationService.refresh(user);
  }

  @Get('logout')
  @Authentication(AuthTypes.REFRESH)
  @UseGuards(AuthenticationGuard)
  async logout(
    @Cookies(AuthTypes.REFRESH) refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ response: string }> {
    res.clearCookie(AuthTypes.REFRESH);
    const response = await this.authenticationService.logout(refreshToken);
    return { response };
  }
}
