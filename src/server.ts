/* eslint-disable func-names */

import { Server } from "http";
import { setupApplication, teardownApplication } from "./utils/setup";
import { properties } from "./utils/properties";
import { logger } from "./utils/logger";
import { app, initRoutes } from "./api/index";

class ServerAPI {
  public server: Server;

  public listening: Promise<null>;

  public async start(configsFolder: string) {
    // Import configs and configure app
    properties.init(configsFolder);
    initRoutes();

    // Hack to allow us to wait on server listening
    let resolveListening: Function;
    this.listening = new Promise<null>((resolve, reject) => {
      resolveListening = resolve;
    });

    // Perform any pre-flight tasks required to start the server
    const self = this;
    await setupApplication()
      .then(() => {
        // Start the application server
        self.server = app.listen(properties.server.port);

        self.server.on("listening", () => {
          logger.info(`Listening on port ${properties.server.port}.`);
          resolveListening();
        });

        self.server.on("close", () => {
          teardownApplication();
        });

        self.server.on("error", (error: any) => {
          logger.error(`Error running server: ${error.message}`);

          self.server.close(() => {
            process.exit(1);
          });
        });
      })
      .catch((err) => {
        logger.error(`Failed to set up the application: ${err}`);
        process.exit(1);
      });
  }

  public stop() {
    this.server.close();
  }
}

export const api = new ServerAPI();
