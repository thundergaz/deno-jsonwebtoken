import { JsonWebTokenError } from './JsonWebTokenError.ts';
export class NotBeforeError extends JsonWebTokenError {
  constructor (message: string, readonly date: Date) {
    super(message);
    this.name = 'NotBeforeError';
  }
}
