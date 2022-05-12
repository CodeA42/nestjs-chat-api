import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './Admin.service';
import { Roles } from '../decorators/Roles.decorator';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { AuthTypes } from 'src/@types/AuthTypes';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { AuthorizationGurad } from 'src/guards/Authorization.guard';
import { NewPaswordDto } from 'src/dto/NewPasswordDto';
import { UpdateChatDataDto } from 'src/dto/UpdateChatDataDto';
import { RoleTypes } from 'src/@types/RoleTypes';
import Chat from 'src/entities/Chat.entity';

@Controller('chat/:chatId/admin')
@UseGuards(AuthenticationGuard, AuthorizationGurad)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Delete('delete_room')
  @Roles(RoleTypes.ADMIN)
  @Authentication(AuthTypes.ACCESS)
  async getRoute(@Param('chatId') id: string): Promise<{ id: string }> {
    return { id: await this.adminService.deleteRoom(id) };
  }

  @Get('transfer_ownership/:userId')
  @Roles(RoleTypes.ADMIN)
  @Authentication(AuthTypes.ACCESS)
  async transferOwnership(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    await this.adminService.transferOwnership(chatId, userId);
    return;
  }

  @Put('password')
  @Roles(RoleTypes.ADMIN)
  @Authentication(AuthTypes.ACCESS)
  async changePassword(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body() newPasswordDto: NewPaswordDto,
  ): Promise<{ id: string }> {
    return {
      id: await this.adminService.changePassword(chatId, newPasswordDto),
    };
  }

  @Put('')
  @Roles(RoleTypes.ADMIN)
  @Authentication(AuthTypes.ACCESS)
  async updateRoom(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Body() updateData: UpdateChatDataDto,
  ): Promise<Chat> {
    return await this.adminService.updateRoom(chatId, updateData);
  }

  @Get('kick/:userId')
  @Roles(RoleTypes.ADMIN)
  @Authentication(AuthTypes.ACCESS)
  kickUser(
    @Param('chatId', ParseUUIDPipe) chatId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) {
    return this.adminService.kickUser(chatId, userId);
  }
}
