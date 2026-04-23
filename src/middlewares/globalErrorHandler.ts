import { ErrorRequestHandler } from 'express';

import httpStatus from 'http-status';
import config from '../app/config';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Something went wrong!';

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages: error.message ? [{ path: '', message: error.message }] : [],
    stack: config.env !== 'production' ? error?.stack : undefined,
  });
};

export default globalErrorHandler;