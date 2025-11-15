import apiError from "../utils/apiErrors";
import { envConfig } from "../config/config";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log("The error is caught by middleware: ", err);

  // ✅ Custom apiError handler
  if (err instanceof apiError) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      data: err.data || null,
      success: err.success,
      error: err.error || [],
      stack: envConfig.node_env === "development" ? err.stack : undefined,
    });
    return;
  }

  // ✅ Zod validation error
  if (err instanceof ZodError) {
    const firstError = err.errors[0]?.message || "Invalid input";

    res.status(400).json({
      statusCode: 400,
      message: firstError,
      data: null,
      success: false,
      error: err.errors,
      stack: envConfig.node_env === "development" ? err.stack : undefined,
    });
    return;
  }

  // ❌ Internal server fallback
  res.status(500).json({
    statusCode: 500,
    message: "Internal Server Error",
    data: null,
    success: false,
    error: [],
    stack: envConfig.node_env === "development" ? err.stack : undefined,
  });
};

export default errorHandler;
