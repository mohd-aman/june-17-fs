// An error that knows its own HTTP status: the "labelled envelope"

class AppError extends Error{
  constructor(message,statusCode){
    super(message);
    this.statusCode = statusCode
    this.isOperational = true;
  }
}

module.exports = AppError;