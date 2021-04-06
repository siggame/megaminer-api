import { Router, Request, Response, NextFunction } from "express";
import { RouteInfo, swaggerSetup } from "../services/swaggerService";

const staticFileRoot = { root: `${__dirname}/../../static` };

const router = Router();

/**
 * Returns main CSS file.
 */
async function getCSS(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).sendFile("main.css", staticFileRoot);
  } catch (err) {
    return next(err);
  }
}

router.get("/css", getCSS);

/**
 * Returns the ACM Game wrench logo.
 */
async function getWrench(req: Request, res: Response, next: NextFunction) {
  try {
    return res.status(200).sendFile("wrench.svg", staticFileRoot);
  } catch (err) {
    return next(err);
  }
}

router.get("/wrench", getWrench);

export { router };

const cssRouteInfo: RouteInfo = {
  "x-swagger-router-controller": "cdnRouter",
  operationId: "css",
  tags: ["CDN"],
  description: "Get main CSS styling.",
  parameters: [],
  responses: {},
};

swaggerSetup.addRouteToSwaggerDoc("/cdn/css", "get", cssRouteInfo);

const wrenchRouteInfo: RouteInfo = {
  "x-swagger-router-controller": "cdnRouter",
  operationId: "wrench",
  tags: ["CDN"],
  description: "Get the ACM Game wrench logo.",
  parameters: [],
  responses: {},
};

swaggerSetup.addRouteToSwaggerDoc("/cdn/wrench", "get", wrenchRouteInfo);
