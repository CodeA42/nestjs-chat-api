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
import { Authentication } from 'src/decorators/authentication.decorator';
import { User } from 'src/decorators/user.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { ChatService } from './chat.service';
import { CreateChatDto } from '../dto/CreateChatDto';
import { TokenUserDto } from 'src/dto/TokenUserDto';
import Chat from 'src/entities/Chat.entity';
import { chatPasswordDto } from 'src/dto/ChatPasswordDto';
import { Roles } from 'src/decorators/roles.decorator';
import { RoleTypes } from 'src/@types/RoleTypes';
import { AuthorizationGurad } from 'src/guards/Authorization.guard';

@Controller('chat')
@UseGuards(AuthenticationGuard, AuthorizationGurad)
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

  @Get('/:chatId')
  @Authentication(AuthTypes.ACCESS)
  getChatRoom(@Param('chatId', ParseUUIDPipe) id: string): Promise<Chat> {
    return this.chatService.getChatWithoutPassword(id);
  }

  @Post('/:chatId/join')
  @Authentication(AuthTypes.ACCESS)
  joinChat(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body() password: chatPasswordDto,
    @User('id', ParseUUIDPipe) userId: string,
  ) {
    return this.chatService.joinChat(chatId, password.password, userId);
  }

  @Get('/:chatId/leave')
  @Authentication(AuthTypes.ACCESS)
  @Roles(RoleTypes.NOT_ADMIN)
  async leaveChat(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @User('id', ParseUUIDPipe) userId: string,
  ) {
    await this.chatService.leaveChat(chatId, userId);
    return;
  }

  @Get('/:chatId/users')
  @Authentication(AuthTypes.ACCESS)
  @Roles(RoleTypes.CHAT_MEMBER)
  getAllChatMembers(@Param('chatId', ParseUUIDPipe) id: string) {
    return this.chatService.getAllChatMembers(id);
  }
}
