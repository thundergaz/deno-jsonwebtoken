import { JsonWebTokenError } from './JsonWebTokenError.ts';

export class TokenExpiredError extends JsonWebTokenError {
  constructor (message: string, readonly expiredAt: number) {
    super(message);
    this.name = 'TokenExpiredError';
  }
}
