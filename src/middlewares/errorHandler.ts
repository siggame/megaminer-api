import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/**
 * Middleware to handle request errors, rather than using the default one provided by Express.
 */
export function handleErrors(err: any, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err.status || 500;
  const errorResponse = {
    message: err.message || "Server error, please open a service ticket if the error persists"
  };

  res.status(statusCode).json(errorResponse);
}