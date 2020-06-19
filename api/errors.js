const { ValidationError } = require("jsonschema");
require("dotenv").config();

class AppError extends Error {
  constructor(message, status) {
    super(message);

    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

function custom404(req, res, next) {
  next(
    new AppError(
      `${req.method} on ${req.originalUrl} is not a valid request.`,
      404
    )
  );
}

function errorHandling(error, req, res, next) {
  console.error(error);
  //handle ValidationErrors, which are sent as an array
  if (error[0] instanceof ValidationError) {
    const message = error.map(e => e.stack.replace(/"/g, "'"));
    return res.status(400).json({ message });
  }
  //send verbose errors if they were manually generated
  //or if we're in a development environment
  if (error instanceof AppError || process.env.NODE_ENV === "development") {
    const { status = 500, message = "Error" } = error;
    return res.status(status).json({ message });
  }

  //send uninformative errors if we're in production
  return res.status(500).json({ message: "Server error" });
}

module.exports = { AppError, catchAsync, custom404, errorHandling };
