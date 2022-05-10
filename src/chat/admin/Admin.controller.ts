import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './Admin.service';
import { Roles } from '../../decorators/Roles.decorator';
import { Authentication } from 'src/decorators/Authentication.decorator';
import { AuthTypes } from 'src/@types/AuthTypes';
import { AuthenticationGuard } from 'src/guards/Authentication.guard';
import { AuthorizationGurad } from 'src/guards/Authorization.guard';

@Controller('chat/:chatId/admin')
@UseGuards(AuthenticationGuard, AuthorizationGurad)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Delete('delete_room')
  @Roles('admin')
  @Authentication(AuthTypes.ACCESS)
  getRoute(@Param('chatId') id: string) {
    return `Param: ${id}`;
  }

  @Get('transfer/:userId')
  @Roles('admin')
  @Authentication(AuthTypes.ACCESS)
  transferOwnership(
    @Param('chatId') chatId: string,
    @Param('userId') userId: string,
  ) {
    return this.adminService.transferOwnership(chatId, userId);
  }
}
