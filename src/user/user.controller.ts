import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ): any {
    const response = this.userService.register(username, email, password);
    return response;
  }
}
