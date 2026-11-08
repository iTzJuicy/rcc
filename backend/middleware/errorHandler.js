import { captureException } from "../config/sentry.js";

export function notFoundHandler(req, res, next) {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function globalErrorHandler(err, req, res, next) {
  let statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || "An unexpected server error occurred.";

  // Log to Sentry
  captureException(err, { path: req.originalUrl, method: req.method });

  // MongoDB duplicate key error (e.g. duplicate slug or email)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A record with that ${field} already exists. Please choose a unique value.`;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  if (err.name === "MulterError") {
    statusCode = 400;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "Image file is too large. The maximum size is 5 MB.";
    }
  }

  // CastError (invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found with specified identifier.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

export default { notFoundHandler, globalErrorHandler };
