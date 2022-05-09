import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Authentication } from 'src/decorators/Authentication.decorator';
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
  createChat(@Body() newChatData: CreateChatDto, @Req() req: Request) {
    this.chatService.createChat(newChatData, req);
  }
}
