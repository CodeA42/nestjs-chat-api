import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';
import { MessageDataDto } from 'src/dto/MessageDataDto';

Injectable();
export class GatewayService {
  async validateMessageData(messageData: MessageDataDto): Promise<boolean> {
    const message = new MessageDataDto(messageData);
    const errors = await validate(message);
    return errors.length === 0;
  }
}
