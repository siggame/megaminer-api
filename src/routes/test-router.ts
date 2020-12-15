import { Router, Request, Response, NextFunction } from "express";

async function testRoute(_req: Request, res: Response, _next: NextFunction) {
  return res.status(200).send("Hello world!");
}

const router: Router = Router();

router.post('/', testRoute);

export { router };