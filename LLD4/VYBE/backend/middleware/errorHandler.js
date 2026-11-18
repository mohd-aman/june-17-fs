const AppError = require("../utils/AppError");

// Four arguments: this is how Express knows it is an error handler
const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Oops, Something went wrong",
  });
};

const notFound = (req, res, next) => {
  next(new AppError("Route not found", 404));
};

module.exports = { notFound, errorHandler };