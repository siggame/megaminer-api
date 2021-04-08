import { RouteConfig } from "../../services/swaggerService";

export const swaggerRoutes: Array<RouteConfig> = [
  {
    method: "get",
    route: "/info",
    options: {
      "x-swagger-router-controller": "InfoRouter",
      operationId: "get",
      tags: ["Info"],
      description: "Get application information.",
      parameters: [],
      responses: {},
    },
  },
];
