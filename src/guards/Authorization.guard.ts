import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { validate } from 'class-validator';
import { Request } from 'express';
import { RoleTypes } from 'src/@types/RoleTypes';
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
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    let isAuthorized = false;

    const req: Request = context.switchToHttp().getRequest();
    const chatId = req.params.chatId;
    const userId = req.user.id;

    if (await this.chatIdIsInvalid(chatId)) {
      return false;
    }

    if (roles.includes(RoleTypes.CHAT_MEMBER)) {
      isAuthorized = await this.userIsMember(chatId, userId);
    }

    if (roles.includes(RoleTypes.ADMIN)) {
      isAuthorized = await this.userIsAdminOfChat(chatId, userId);
    }

    return isAuthorized;
  }

  private async userIsMember(chatId: string, userId: string): Promise<boolean> {
    const users: User[] = await this.chatService.getAllChatMembers(chatId);

    return users.some((e) => e.id == userId);
  }

  private async userIsAdminOfChat(
    chatId: string,
    userId: string,
  ): Promise<boolean> {
    const chatAdmin: User = await this.chatService.getChatAdmin(chatId);
    return chatAdmin.id === userId;
  }

  private async chatIdIsInvalid(id: string): Promise<boolean> {
    const chatIdDto = new ChatIdDto();
    chatIdDto.id = id;
    const validationErrors = await validate(chatIdDto);
    if (validationErrors.length === 0) {
      return false;
    }
    return true;
  }
}
