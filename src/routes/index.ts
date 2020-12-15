import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as morgan from 'morgan';
import * as cors from 'cors';
import * as swaggerUi from 'swagger-ui-express';
import * as path from "path";
import * as fs from "fs"
import { Express, Request, Response } from 'express';
import { stream } from '../utils/logger';
import { properties } from '../utils/configs';
import { swaggerSetup } from '../services/swaggerService'
import { authenticate } from '../middlewares/auth';
import { handleErrors } from '../middlewares/errorHandler';

export const app: Express = express();
const SQLiteStore = require('connect-sqlite3')(session);

/* middleware */
app.use(morgan("tiny", { stream: stream as any })); // Use morgan 'tiny' format to log requests
app.use(bodyParser.json()); // Parse JSON in the body of requests
app.use(compression()); // Compress responses

// Handle session information
app.use(session({
  secret: properties.server.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new SQLiteStore
}));

// Enable CORS for the entire application (with pre-flight requests)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Range']
}));

// Regex pattern to match data needed load the swagger page
const swaggerPattern = /^\/([^\/]+\.(html|css|js))?$/;

const swaggerUiOptions = {
  swaggerUrl: "/swagger",
  swaggerOptions: {
    validatorUrl: null,
    docExpansion: "none",
    tagsSorter: "alpha"
  }
};

// Serve swagger from root ("/")
app.get(swaggerPattern, swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions, {validatorUrl : null}, null, null, '/swagger'));

// Serve swagger spec as JSON at "/swagger"
app.get('/swagger', function(_req: Request, res: Response) {
  res.json(swaggerSetup.getSwaggerDoc());
});

// Call authenticate every time the app receives a request
// Placed after swagger routes so we don't need to auth for those
app.use(authenticate);

// Add dynamic routes from routes/{name}-router.ts as "/{name}"
fs.readdirSync(__dirname).filter((file: string) => {
  return file.indexOf("-router") !== -1;
}).forEach((file: string) => {
  const route = require(path.join(__dirname, file)).router;
  const name = file.split('-router')[0];
  app.use('/' + name, route);
});

// Called if none of the above paths are hit (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({error: "Not Found"});
});

// Finally, call the error handler if necessary
app.use(handleErrors);