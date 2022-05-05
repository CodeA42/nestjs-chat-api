import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { JoiValidationPipe } from 'src/validation/joi.validation';
import { UserAuthDto } from './dto/UserAuthDto';
import createUserSchema from './validationSchemas/createUser.schema';
import { AuthenticationService } from './authentication.service';
import loginUserSchema from './validationSchemas/loginUser.schema';
import { Request, Response } from 'express';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { AuthTypes } from 'src/@types/AuthTypes';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';

@Controller('')
export class AuthenticationController {
  constructor(private readonly userService: AuthenticationService) {}

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
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const [accessToken, refreshToken] = await this.userService.login(
      userAuthDto,
      headers['user-agent'],
    );
    res.cookie('refreshToken', refreshToken, { httpOnly: true });
    return { accessToken };
  }

  @Get('refresh')
  @Authentication(AuthTypes.REFRESH)
  @UseGuards(AuthenticationGuard)
  refresh(@Req() req: Request) {
    return this.userService.refresh(req);
  }
}
