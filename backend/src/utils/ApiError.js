/**
 * Custom error class carrying an HTTP status code, so services can
 * throw semantic errors (404, 409, 400 ...) and the central error
 * handler middleware knows exactly how to respond.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static badRequest(message = 'Invalid request', details = null) {
    return new ApiError(400, message, details);
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message);
  }
}

module.exports = ApiError;
