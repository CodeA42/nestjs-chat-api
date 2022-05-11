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
import Chat from 'src/entities/Chat.entity';
import { chatPasswordDto } from 'src/dto/ChatPasswordDto';
import { ChatRoomKey } from 'src/@types';

@Controller('chat')
@UseGuards(AuthenticationGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/')
  @Authentication(AuthTypes.ACCESS)
  async createChat(
    @Body() newChatData: CreateChatDto,
    @User() user: TokenUserDto,
  ): Promise<{ id: string }> {
    return { id: await this.chatService.createChat(newChatData, user.id) };
  }

  @Get('/')
  @Authentication(AuthTypes.ACCESS)
  getAllChats(): Promise<{ id: string; name: string }[]> {
    return this.chatService.getAllChats();
  }

  @Get('/:id')
  @Authentication(AuthTypes.ACCESS)
  getChatRoom(@Param('id', ParseUUIDPipe) id: string): Promise<Chat> {
    return this.chatService.getChat(id);
  }

  @Post('/:id/join')
  @Authentication(AuthTypes.ACCESS)
  joinChat(
    @Param('id', ParseUUIDPipe) chatId: string,
    @Body() password: chatPasswordDto,
    @User('id') userId: string,
  ): Promise<ChatRoomKey> {
    return this.chatService.joinChat(chatId, password.password, userId);
  }
}
