export class JsonWebTokenError extends Error {
  readonly inner: Error | undefined;
  constructor (message: string, error?: Error) {
    super(message);
    if(Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    this.name = 'JsonWebTokenError';
    this.message = message;
    if (error) this.inner = error;
  }
}
