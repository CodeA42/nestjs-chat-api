import { HttpException, HttpStatus } from '@nestjs/common';

export default class SessionExpiredException extends HttpException {
  constructor(message = 'Session expired') {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = 'SessionExpiredException';
  }
}
