import { RouteConfig } from "../../services/swaggerService";

export const swaggerRoutes: Array<RouteConfig> = [
  {
    method: "get",
    route: "/cdn/css",
    options: {
      "x-swagger-router-controller": "cdnRouter",
      operationId: "css",
      tags: ["CDN"],
      description: "Get main CSS styling.",
      parameters: [],
      responses: {},
    },
  },
  {
    method: "get",
    route: "/cdn/wrench",
    options: {
      "x-swagger-router-controller": "cdnRouter",
      operationId: "wrench",
      tags: ["CDN"],
      description: "Get the ACM Game wrench logo.",
      parameters: [],
      responses: {},
    },
  },
];
