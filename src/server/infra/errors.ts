export class HttpNotFoundError extends Error {
  readonly status: number;

  constructor(message: string) {
    super();
    this.message = message;
    this.status = 404;
  }
}
