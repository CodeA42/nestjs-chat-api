import { HttpException, HttpStatus } from '@nestjs/common';

export default class UsernameExistsException extends HttpException {
  constructor(message = 'Username Exists') {
    super(message, HttpStatus.CONFLICT);
    this.name = 'UsernameExistsException';
  }
}
