import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from 'src/validation/joi.validation';
import { CreateUserDto } from './dto/user.dto';
import createUserSchema from './schemas/createUser.schema';
import { UserService } from './user.service';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  register(@Body() createUserDto: CreateUserDto): any {
    const response = this.userService.register(createUserDto);
    return response;
  }
}
