import { SwaggerOptions } from 'swagger-ui-express';
import { projectPackage } from '../utils/package'
import {logger} from '../utils/logger';

export class SwaggerSetup {
  private swagger: SwaggerOptions;

  constructor() {
    this.swagger = {
      "swagger": "2.0",
       "info": {
         "title": projectPackage.name,
         "description": projectPackage.description,
         "version": projectPackage.version
       },
       "externalDocs":{
         "description": "Github Repo",
         "url": projectPackage.homepage
       },
       "produces": ["application/json"],
       "paths": {},
       "definitions": {}
     };
  }

  getSwaggerDoc() {
    return this.swagger;
  }

  addRouteToSwaggerDoc(route: string, method: string, routeInfo: RouteInfo) {
    logger.debug(`Adding route to swagger doc: ${method} ${route}`);

    if (!this.swagger.paths[route]) {
      this.swagger.paths[route] = {};
    }

    this.swagger.paths[route][method] = routeInfo;
  }
}

interface SwaggerParameter{
  name: string;
  in: string;
  required: boolean;
  type?: string;
  schema?: any;
  description?: string;
}

export class RouteInfo{
  public "x-swagger-router-controller": string;
  public operationId: string = "index";
  public tags: string[];
  public description: string;
  public parameters: SwaggerParameter[];
  public responses: any = {};

  constructor(groupName:string){
    this["x-swagger-router-controller"] = groupName;
    this.tags = [groupName];
  }
}

export const swaggerSetup = new SwaggerSetup();

const generateRouteInfo: RouteInfo = {
  "x-swagger-router-controller": 'GenerateProject',
  "operationId": "generate",
  "tags": ["Template"],
  "description": "Generate a project using a template.",
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
// swaggerSetup.addRouteToSwaggerDoc("/blah", "post", generateRouteInfo);