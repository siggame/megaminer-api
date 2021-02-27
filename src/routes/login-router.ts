import { Router, Request, Response, NextFunction } from "express";
import { RouteInfo, swaggerSetup } from "../services/swaggerService";
import { User } from "../models/user";
import { cleanUserData, getHashedPassword } from "../services/passwordService";
import { logger } from "../utils/logger";

/**
 * Returns the user information of the given login, if valid.
 */
async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password } = req.body;
    logger.info(`Received new login request from user ${username}`);
    const matchingUser = await User.findOne({ username });

    if (matchingUser) {
      logger.info("Found matching user");
      const salt = matchingUser.salt;
      const encryptedPassword = await getHashedPassword(password, salt);
      if (encryptedPassword === matchingUser.password) {
        logger.info("Login successful");
        return res.status(200).json(cleanUserData(matchingUser));
      }
      return next({
        status: 404,
        message: "Login attempt failed.",
      });
    }

    return next({
      status: 404,
      message: "Login attempt failed.",
    });
  } catch (err) {
    return next(err);
  }
}

const router = Router();

router.post("/", login);

export { router };

const loginRouteInfo: RouteInfo = {
  "x-swagger-router-controller": "LoginRouter",
  operationId: "login",
  tags: ["Login"],
  description: "Log in to the application.",
  parameters: [
    {
      name: "body",
      description: `The username and password being used to attempt to log in.`,
      in: "body",
      required: true,
      type: "object",
    },
  ],
  responses: {},
};

swaggerSetup.addRouteToSwaggerDoc("/login", "post", loginRouteInfo);
