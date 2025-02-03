const ApiError = require('../utils/ApiError');
const { NODE_ENV } = process.env;

// Convert non-ApiError exceptions to ApiError format
const errorConverter = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose errors
  if (error.name === 'CastError') { // Invalid ID format
    error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }
  if (error.code === 11000) { // Duplicate field
    const field = Object.keys(error.keyValue)[0];
    error = new ApiError(400, `${field} must be unique`);
  }
  if (error.name === 'ValidationError') { // Schema validation failed
    error = new ApiError(400, Object.values(error.errors).map(e => e.message).join(', '));
  }

  // Handle generic errors
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

// Final error response formatter
const errorHandler = (err, req, res, next) => {
  const { statusCode, message, isOperational, stack } = err;

  // Development: Full error details
  if (NODE_ENV === 'development') {
    res.status(statusCode).json({
      success: false,
      message,
      operational: isOperational,
      stack: stack
    });
  } 
  // Production: Minimal details
  else {
    res.status(statusCode).json({
      success: false,
      message
    });
  }
};

module.exports = { errorConverter, errorHandler };