import { RouteConfig } from "../../services/swaggerService";

export const swaggerRoutes: Array<RouteConfig> = [
  {
    method: "post",
    route: "/login",
    options: {
      "x-swagger-router-controller": "LoginRouter",
      operationId: "login",
      tags: ["Login"],
      description: "Log in to the application.",
      parameters: [
        {
          name: "body",
          description: `The username and password being used to attempt to log in.`,
          in: "body",
          required: true,
          type: "object",
        },
      ],
      responses: {},
    },
  },
  {
    method: "get",
    route: "/login",
    options: {
      "x-swagger-router-controller": "LoginRouter",
      operationId: "currentUser",
      tags: ["Login"],
      description: "Get the current logged in user.",
      parameters: [],
      responses: {},
    },
  },
];
