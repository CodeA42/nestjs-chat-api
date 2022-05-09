import { Controller, Delete, Get, Param } from '@nestjs/common';
import { AdminService } from './Admin.service';

@Controller('chat/:chatid/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Delete('delete_room')
  getRoute(@Param('chatid') id: string) {
    return `Param: ${id}`;
  }
}
