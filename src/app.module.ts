import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import Token from './entities/Token.entity';
import User from './entities/User.entity';
import { AuthenticationModule } from './authentication/authentication.module';
import { ChatModule } from './chat/Chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nestapiuser',
      password: 'megasecret',
      database: 'nestapidb',
      entities: [Token, User],
      synchronize: true,
    }),
    ConfigModule.forRoot(),
    AuthenticationModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
