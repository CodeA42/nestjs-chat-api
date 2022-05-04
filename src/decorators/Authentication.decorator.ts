import { SetMetadata } from '@nestjs/common';

export const Authentication = (authentication: string) =>
  SetMetadata('authentication', authentication);
