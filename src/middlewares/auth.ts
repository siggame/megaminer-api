import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { getUserInfo } from '../services/userService';

/**
 * Fetch user info and store it in the express-session.
 */
async function setUserInfo(req: Request) {
  const userInfo = await getUserInfo();
  req.session.userInfo = userInfo;
}

/**
 * Authenticate any user trying to use the application.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  // If the user is not already identified
  if (!req.session.userInfo) {
    try {
      // Request user info and store it
      await setUserInfo(req);
    } catch (err) {
      // Reject users who cannot be identified
      return next({
        status: 403,
        message: 'No user on request.'
      });
    }
  }

  return next();
}