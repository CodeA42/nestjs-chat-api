import { HttpException, HttpStatus } from '@nestjs/common';

export default class WrongCredentialsException extends HttpException {
  constructor(message = 'Wrong credentials') {
    super(message, HttpStatus.CONFLICT);
    this.name = 'WrongCredentialsException';
  }
}
