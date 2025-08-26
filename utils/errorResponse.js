class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 400;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorResponse