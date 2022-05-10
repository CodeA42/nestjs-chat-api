import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { TokenUser } from 'src/@types';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { User } from 'src/decorators/User.decorator';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { JoiValidationPipe } from 'src/validation/joi.validation';
import { ChatService } from './Chat.service';
import { CreateChatDto } from './dto/CreateChatDto';
import createChatSchema from './validationSchemas/createChat.schema';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create_chat')
  @UsePipes(new JoiValidationPipe(createChatSchema))
  @Authentication(AuthTypes.ACCESS)
  @UseGuards(AuthenticationGuard)
  createChat(@Body() newChatData: CreateChatDto, @User('id') userId: string) {
    this.chatService.createChat(newChatData, userId);
  }
}
