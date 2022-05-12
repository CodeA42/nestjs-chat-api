import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Token from './entities/Token.entity';
import User from './entities/User.entity';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChatModule } from './chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import Chat from './entities/Chat.entity';
import Message from './entities/Message.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nestapiuser',
      password: 'megasecret',
      database: 'nestapidb',
      entities: [Token, User, Chat, Message],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    AuthenticationModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
