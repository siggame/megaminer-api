import { Router, Request, Response, NextFunction } from 'express';
import { RouteInfo, swaggerSetup } from '../services/swaggerService';

async function testRoute(_req: Request, res: Response, _next: NextFunction) {
  return res.status(200).send("Hello world!");
}

const router: Router = Router();

router.post('/', testRoute);

export { router };

const testRouteInfo: RouteInfo = {
  "x-swagger-router-controller": 'TestRoute',
  "operationId": "test",
  "tags": ["TestSection"],
  "description": "This is a test route.",
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
swaggerSetup.addRouteToSwaggerDoc("/test", "post", testRouteInfo);