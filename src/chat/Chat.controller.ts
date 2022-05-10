import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { User } from 'src/decorators/User.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { ChatService } from './Chat.service';
import { CreateChatDto } from '../dto/CreateChatDto';
import { TokenUserDto } from 'src/dto/TokenUserDto';

@Controller('chat')
@UseGuards(AuthenticationGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/')
  @Authentication(AuthTypes.ACCESS)
  createChat(@Body() newChatData: CreateChatDto, @User() user: TokenUserDto) {
    return this.chatService.createChat(newChatData, user.id);
  }

  @Get('/')
  @Authentication(AuthTypes.ACCESS)
  getAllChats() {
    return this.chatService.getAllChats();
  }

  @Get('/:id')
  @Authentication(AuthTypes.ACCESS)
  getChatRoom(@Param('id', ParseUUIDPipe) id: string) {
    return this.chatService.getChat(id);
  }
}
