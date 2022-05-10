import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { validate } from 'class-validator';
import { Request } from 'express';
import { ChatService } from 'src/chat/Chat.service';
import { ChatIdDto } from 'src/dto/ChatIdDto';
import User from 'src/entities/User.entity';

@Injectable()
export class AuthorizationGurad implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ChatService) private readonly chatService: ChatService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    let isAuthorized = false;

    const chatIdDto = new ChatIdDto();
    chatIdDto.id = req.params.chatId;
    const validationErrors = await validate(chatIdDto);

    if (validationErrors.length === 0) {
      const chatAdmin: User = await this.chatService.getChatAdmin(chatIdDto.id);

      isAuthorized = chatAdmin.id === req.user.id;
    } else {
      isAuthorized = false;
    }

    return isAuthorized;
  }
}
