export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode || error.status || 500;

  if (error.code === "P2025") {
    return res.status(404).json({ message: "Resource not found" });
  }

  if (error.code === "P2002") {
    return res.status(400).json({ message: "Resource already exists" });
  }

  const response = {
    message: statusCode === 500 ? "Internal server error" : error.message
  };

  if (error.errors) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    response.detail = error.message;
  }

  return res.status(statusCode).json(response);
};
