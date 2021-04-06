import { Router, Request, Response, NextFunction } from "express";
import { RouteInfo, swaggerSetup } from "../services/swaggerService";

/**
 * Returns main CSS file.
 */
async function getCSS(req: Request, res: Response, next: NextFunction) {
  try {
    return res
      .status(200)
      .sendFile("main.css", { root: `${__dirname}/../../static` });
  } catch (err) {
    return next(err);
  }
}

const router = Router();

router.get("/css", getCSS);

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
