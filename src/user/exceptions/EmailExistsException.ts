import { HttpException, HttpStatus } from '@nestjs/common';

export default class EmailExistsException extends HttpException {
  constructor(message = 'Email Exists') {
    super(message, HttpStatus.CONFLICT);
    this.name = 'EmailExistsException';
  }
}
