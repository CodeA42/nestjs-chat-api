import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthTypes } from 'src/@types/AuthTypes';
import { Authentication } from 'src/decorators/authentication.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { MessageBodyDto } from 'src/dto/MessageBodyDto';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { AuthorizationGurad } from 'src/guards/Authorization.guard';
import { MessageService } from './message.service';
import { RoleTypes } from 'src/@types/RoleTypes';
import { MessageDataDto } from 'src/dto/MessageDataDto';
import { User } from 'src/decorators/user.decorator';

@Controller('/chat/:chatId/message')
@UseGuards(AuthenticationGuard, AuthorizationGurad)
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:messageId')
  @Authentication(AuthTypes.ACCESS)
  getMessage(@Param('messageId', ParseUUIDPipe) messageId: string) {
    return this.messageService.getMessage(messageId);
  }

  @Put('/:messageId')
  @Authentication(AuthTypes.ACCESS)
  @Roles('messageOwner')
  updateMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() messageBody: MessageBodyDto,
  ) {
    return this.messageService.updateMessage(messageId, messageBody.body);
  }

  @Delete('/:messageId')
  @Authentication(AuthTypes.ACCESS)
  @Roles('messageOwner')
  deleteMessage(@Param('messageId', ParseUUIDPipe) messageId: string) {
    return this.messageService.deleteMessage(messageId);
  }

  @Post()
  @Authentication(AuthTypes.ACCESS)
  @Roles(RoleTypes.CHAT_MEMBER)
  createMessage(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body() messageBody: MessageBodyDto,
    @User('id') userId: string,
  ) {
    return this.messageService.createMessage({
      chatId,
      body: messageBody.body,
      userId,
    });
  }
}
