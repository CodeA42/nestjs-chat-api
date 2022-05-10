import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ChatService } from 'src/chat/Chat.service';
import User from 'src/entities/User.entity';

@Injectable()
export class AuthorizationGurad implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(ChatService) private readonly chatService: ChatService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();

    const chatId: string = req.params.chatId;
    const chatAdmin: User = await this.chatService.getChatAdmin(chatId);

    const isAuthorized: boolean = chatAdmin.id === req.user.id;

    return isAuthorized;
  }
}
