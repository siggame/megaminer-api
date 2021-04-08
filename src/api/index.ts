import * as express from "express";
import * as session from "express-session";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as morgan from "morgan";
import * as cors from "cors";
import { setup, serve, SwaggerUiOptions } from "swagger-ui-express";
import * as path from "path";
import * as fs from "fs";
import * as m2s from "mongoose-to-swagger";
import * as restify from "express-restify-mongoose";
import { stream } from "../utils/logger";
import { properties } from "../utils/properties";
import { RouteConfig, swaggerSetup } from "../services/swaggerService";
import { authenticate } from "./middleware/auth";
import { handleErrors } from "./middleware/errorHandler";

export const app = express();
const SQLiteStore = require("connect-sqlite3")(session);

/* middleware */
app.use(morgan("tiny", { stream: stream as any })); // Use morgan 'tiny' format to log requests
app.use(bodyParser.json()); // Parse JSON in the body of requests
app.use(compression()); // Compress responses

export function initRoutes() {
  // Handle session information
  app.use(
    session({
      secret: properties.server.sessionSecret,
      resave: false,
      saveUninitialized: true,
      store: new SQLiteStore(),
    })
  );

  // Enable CORS for the entire application (with pre-flight requests)
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      optionsSuccessStatus: 200,
      exposedHeaders: ["Content-Range"],
    })
  );

  // Regex pattern to match data needed load the swagger page
  const swaggerPattern = /^\/([^/]+\.(html|css|js))?$/;

  const swaggerUiOptions: SwaggerUiOptions = {
    swaggerUrl: "/swagger",
    swaggerOptions: {
      validatorUrl: null,
      docExpansion: "none",
      tagsSorter: "alpha",
    },
  };

  // Serve swagger from root ("/")
  app.get(
    swaggerPattern,
    serve,
    setup(
      null,
      swaggerUiOptions,
      { validatorUrl: null },
      null,
      null,
      "/swagger"
    )
  );

  // Serve swagger spec as JSON at "/swagger"
  app.get("/swagger", (_req, res) => {
    res.json(swaggerSetup.getSwaggerDoc());
  });

  // Call authenticate every time the app receives a request
  // Placed after swagger routes so we don't need to auth for those
  app.use(authenticate);

  // Add dynamic routes from routes/{name}Router.ts as "/{name}"
  fs.readdirSync(`${__dirname}/routes`).forEach((file: string) => {
    const route = require(path.join(__dirname, "routes", file)).router;
    const name = file.split("Router")[0];
    app.use(`/${name}`, route);
  });

  // Add swagger routes from routes/{name}Swagger.ts
  fs.readdirSync(`${__dirname}/swagger`).forEach((file: string) => {
    const swaggerRoutes = require(path.join(__dirname, "swagger", file))
      .swaggerRoutes;
    swaggerRoutes.forEach((routeConfig: RouteConfig) => {
      swaggerSetup.addRouteToSwaggerDoc(
        routeConfig.route,
        routeConfig.method,
        routeConfig.options
      );
    });
  });

  // Add model CRUD routes from models/{name}.ts
  fs.readdirSync(`${__dirname}/models`).forEach((file: string) => {
    const modelInfo = require(path.join(__dirname, "models", file));
    const modelName = modelInfo.name;
    const model = modelInfo[modelName];
    const router = express.Router();

    // Add routes to the router and application
    restify.serve(router, model, modelInfo.restifyOptions);
    app.use(router);

    // Add routes and models to the Swagger page
    swaggerSetup.addDefinitionToSwaggerDoc(modelName, m2s(model));
    swaggerSetup.addCrudModelToSwaggerDoc(
      `/${modelInfo.restifyOptions.name}`,
      modelName
    );
  });

  // Called if none of the above paths are hit (404)
  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Finally, call the error handler if necessary
  app.use(handleErrors);
}
