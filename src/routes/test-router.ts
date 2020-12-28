import { Router, Request, Response, NextFunction } from 'express';

import { RouteInfo, swaggerSetup } from '../services/swaggerService';

/* Router routes */
const router = Router();

router.post('/', async (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).send("Hello world!");
});

export { router };

/* Swagger Routes */
const testRouteInfo: RouteInfo = {
  "x-swagger-router-controller": 'TestRoute',
  "operationId": "test",
  "tags": ["TestCategory"],
  "description": "This is a test route. You must pass a JSON body.",
  "parameters": [
    {
      "name": "body",
      "in": "body",
      "required": true
    }
  ],
  "responses": {}
};

// note - must be lowercase method name
swaggerSetup.addRouteToSwaggerDoc('/test', 'post', testRouteInfo);