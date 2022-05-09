import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  @Post('create_chat')
  @UseInterceptors(FileInterceptor('image'))
  createChat(@UploadedFile() image: Express.Multer.File) {
    console.log(image);
  }
}
