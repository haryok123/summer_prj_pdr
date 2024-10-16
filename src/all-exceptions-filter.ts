import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;

    if (exception instanceof UnauthorizedException) {
      console.error('UnauthorizedException:', exception.message);
      response.redirect('/');
      return;
    }
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error',
      error: exception instanceof HttpException ? exception.name : 'Error',
      stack:
        process.env.NODE_ENV === 'development'
          ? exception instanceof HttpException
            ? exception.stack
            : null
          : null,
    };

    console.error(exception);
    response.status(status).render('error', errorResponse);
  }
}
