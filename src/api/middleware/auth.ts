import { Request, Response, NextFunction } from "express";
import { getUserInfo } from "../../services/userService";

/**
 * Authenticate any user trying to use the application.
 */
export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // If the user is not already identified
  if (!req.session.userInfo) {
    try {
      // Request user info and store it
      req.session.userInfo = await getUserInfo();
    } catch (err) {
      // Reject users who cannot be identified
      return next({
        status: 403,
        message: "No user on request.",
      });
    }
  }

  return next();
}
