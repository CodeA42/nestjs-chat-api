/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Events } from 'src/@types/Events';

export class WsExceptionFilter implements BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    console.log(exception);

    const client: Socket = host.switchToWs().getClient();
    const data = host.switchToWs().getData();
    client.emit(Events.IMPROPER_MESSAGE_FORMAT, {
      data,
      error: exception.name,
    });
  }
  handleError<TClient extends { emit: Function }>(
    client: TClient,
    exception: any,
  ): void {
    throw new Error('Method not implemented.');
  }
  handleUnknownError<TClient extends { emit: Function }>(
    exception: any,
    client: TClient,
  ): void {
    throw new Error('Method not implemented.');
  }
  isExceptionObject(err: any): err is Error {
    throw new Error('Method not implemented.');
  }
}
