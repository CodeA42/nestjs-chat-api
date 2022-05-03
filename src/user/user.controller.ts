import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from 'src/validation/joi.validation';
import { UserAuthDto } from './dto/userAuthDto';
import createUserSchema from './schemas/createUser.schema';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  register(@Body() userAuthDto: UserAuthDto): any {
    return this.userService.register(userAuthDto);
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  login(@Body() userAuthDto: UserAuthDto): any {
    return this.userService.login(userAuthDto);
  }
}
