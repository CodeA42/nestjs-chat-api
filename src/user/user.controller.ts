import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { User as UserDecorator } from 'src/decorators/user.decorator';
import { UserService } from './user.service';
import User from 'src/entities/User.entity';

@Controller('user')
@UseGuards(AuthenticationGuard)
export class AuthenticationController {
  constructor(private readonly userService: UserService) {}

  @Get('/chats')
  getUserChats(@UserDecorator('id') id: string): Promise<User> {
    return this.userService.getUserChats(id);
  }
}
