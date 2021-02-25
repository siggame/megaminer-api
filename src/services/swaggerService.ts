/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */

import { SwaggerOptions } from "swagger-ui-express";
import { projectPackage } from "../utils/package";

export class SwaggerSetup {
  private swagger: SwaggerOptions;

  constructor() {
    this.swagger = {
      swagger: "2.0",
      info: {
        title: projectPackage.name,
        description: projectPackage.description,
        version: projectPackage.version,
      },
      externalDocs: {
        description: "Github Repo",
        url: projectPackage.homepage,
      },
      produces: ["application/json"],
      paths: {},
      definitions: {},
    };
  }

  getSwaggerDoc() {
    return this.swagger;
  }

  addRouteToSwaggerDoc(route: string, method: string, routeInfo: RouteInfo) {
    const _method = method.toLowerCase();
    if (!this.swagger.paths[route]) {
      this.swagger.paths[route] = {};
    }

    this.swagger.paths[route][_method] = routeInfo;
  }

  static cleanDefinition(definition: any) {
    delete definition.properties._id;
    delete definition.properties.__v;

    return definition;
  }

  addDefinitionToSwaggerDoc(name: string, definition: any) {
    this.swagger.definitions[name] = SwaggerSetup.cleanDefinition(definition);
  }

  addCrudModelToSwaggerDoc(path: string, model: string) {
    // GET LIST
    const getRouteInfo: RouteInfo = {
      "x-swagger-router-controller": model,
      operationId: "list",
      tags: [model],
      description: `List all ${model}s.`,
      parameters: [
        {
          name: "limit",
          description: "Limit the results coming back.",
          type: "integer",
          in: "query",
          required: false,
        },
        {
          name: "skip",
          description:
            "Sets the starting position of the results coming back. Used in conjunction with limit allows for pagination",
          type: "integer",
          in: "query",
          required: false,
        },
        {
          name: "sort",
          description:
            "Sort the data returned. Examples: sort=name [asc order] or sort=-name [desc order]",
          type: "string",
          in: "query",
          required: false,
        },
        {
          name: "query",
          description:
            'Allows you to filter data. Supports all operators ($regex, $gt, $gte, $lt, $lte, $ne, etc.) as well as shorthands: ~, >, >=, <, <=, !=. Ex: {"name":"Bob"} or {"name":{"$regex":"^(Bob)"}}',
          type: "string",
          in: "query",
          required: false,
        },
      ],
      responses: {
        "200": {
          description: `Successfully retrieved ${model} documents.`,
        },
      },
    };

    this.addRouteToSwaggerDoc(path, "get", getRouteInfo);

    // POST CREATE
    const postRouteInfo: RouteInfo = {
      "x-swagger-router-controller": model,
      operationId: "create",
      tags: [model],
      description: `Create a new ${model}.`,
      parameters: [
        {
          name: "body",
          description: "",
          schema: {
            $ref: `#/definitions/${model}`,
          },
          in: "body",
          required: true,
        },
      ],
      responses: {
        "201": {
          description: `Successfully created a ${model}.`,
        },
      },
    };

    this.addRouteToSwaggerDoc(path, "post", postRouteInfo);

    // GET ID
    const getIdRouteInfo: RouteInfo = {
      "x-swagger-router-controller": model,
      operationId: "get",
      tags: [model],
      description: `Get a single ${model} by ID.`,
      parameters: [
        {
          name: "id",
          description: `The ID of the ${model}.`,
          type: "string",
          in: "path",
          required: true,
        },
      ],
      responses: {
        "200": {
          description: `Successfully retrieved a ${model}.`,
        },
      },
    };

    this.addRouteToSwaggerDoc(`${path}/{id}`, "get", getIdRouteInfo);

    // PUT UPDATE
    const putRouteInfo: RouteInfo = {
      "x-swagger-router-controller": model,
      operationId: "update",
      tags: [model],
      description: `Update a single ${model} by ID.`,
      parameters: [
        {
          name: "id",
          description: `The ID of the ${model} to update.`,
          type: "string",
          in: "path",
          required: true,
        },
        {
          name: "body",
          description: `The updated values of the ${model}.`,
          schema: {
            $ref: `#/definitions/${model}`,
          },
          in: "body",
          required: true,
        },
      ],
      responses: {
        "201": {
          description: `Successfully updated a ${model}.`,
        },
      },
    };

    this.addRouteToSwaggerDoc(`${path}/{id}`, "put", putRouteInfo);

    // DELETE
    const deleteRouteInfo: RouteInfo = {
      "x-swagger-router-controller": model,
      operationId: "delete",
      tags: [model],
      description: `Delete a single ${model} by ID.`,
      parameters: [
        {
          name: "id",
          description: `The ID of the ${model} to delete.`,
          type: "string",
          in: "path",
          required: true,
        },
      ],
      responses: {
        "201": {
          description: `Successfully deleted the ${model}.`,
        },
      },
    };

    this.addRouteToSwaggerDoc(`${path}/{id}`, "delete", deleteRouteInfo);
  }
}

interface SwaggerParameter {
  name: string;
  in: string;
  required: boolean;
  type?: string;
  schema?: any;
  description?: string;
}

export class RouteInfo {
  public "x-swagger-router-controller": string;

  public operationId: string = "index";

  public tags: string[];

  public description: string;

  public parameters: SwaggerParameter[];

  public responses: any = {};

  constructor(groupName: string) {
    this["x-swagger-router-controller"] = groupName;
    this.tags = [groupName];
  }
}

export const swaggerSetup = new SwaggerSetup();
