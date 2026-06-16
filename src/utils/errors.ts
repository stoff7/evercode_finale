export class AppError extends Error {
  statusCode: number;
  code: string;
  timestamp: string;

  constructor(message: string, code = 'APP_ERROR', statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 'BAD_REQUEST', 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ExternalApiError extends AppError {
  constructor(message: string) {
    super(message, 'EXTERNAL_API_ERROR', 502);
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Request timed out') {
    super(message, 'TIMEOUT', 504);
  }
}
