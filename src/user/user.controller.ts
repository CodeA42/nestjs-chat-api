import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Res,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/validation/joi.validation';
import { UserAuthDto } from './dto/UserAuthDto';
import createUserSchema from './validationSchemas/createUser.schema';
import { UserService } from './user.service';
import loginUserSchema from './validationSchemas/loginUser.schema';
import { Cookies } from 'src/decorators/Cookies.decorator';
import { Response } from 'express';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { AuthTypes } from 'src/types/AuthTypes';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  register(@Body() userAuthDto: UserAuthDto): any {
    return this.userService.register(userAuthDto);
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(loginUserSchema))
  async login(
    @Body() userAuthDto: UserAuthDto,
    @Headers() headers,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const [accessToken, refreshToken] = await this.userService.login(
      userAuthDto,
      headers['user-agent'],
    );
    response.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Get('refresh')
  @Authentication(AuthTypes.REFRESH)
  refresh(@Cookies('refreshToken') refreshToken: string) {
    return this.userService.refresh(refreshToken);
  }
}
