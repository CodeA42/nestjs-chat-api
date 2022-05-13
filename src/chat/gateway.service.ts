import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { MessageDataDto } from 'src/dto/MessageDataDto';

Injectable();
export class GatewayService {
  validateMessageData(message: MessageDataDto) {
    return validate(message);
  }
}
