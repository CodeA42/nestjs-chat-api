import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    return {
      // dest: this.configService.get<string>('UPLOAD_LOCATION'),
      limits: {
        fileSize: +this.configService.get<number>('MAX_FILE_SIZE'),
      },
      storage: diskStorage({
        destination: (req: any, file: any, cb: any) => {
          console.log('destination()');

          const uploadPath = this.configService.get<string>('UPLOAD_LOCATION');

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath);
          }
          cb(null, uploadPath);
        },

        filename: (req: any, file: any, cb: any) => {
          console.log('filename()');
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    };
  }
}
