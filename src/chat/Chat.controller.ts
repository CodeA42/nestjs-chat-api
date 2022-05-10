import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { User } from 'src/decorators/User.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { ChatService } from './Chat.service';
import { CreateChatDto } from '../dto/CreateChatDto';
import { TokenUserDto } from 'src/dto/TokenUserDto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create_chat')
  @Authentication(AuthTypes.ACCESS)
  @UseGuards(AuthenticationGuard)
  createChat(@Body() newChatData: CreateChatDto, @User() user: TokenUserDto) {
    return this.chatService.createChat(newChatData, user.id);
  }
}
