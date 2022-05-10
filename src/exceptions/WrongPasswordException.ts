import { HttpException, HttpStatus } from '@nestjs/common';

export default class WrongPasswordException extends HttpException {
  constructor(message = 'Wrong password') {
    super(message, HttpStatus.FORBIDDEN);
    this.name = 'WrongPasswordException';
  }
}
