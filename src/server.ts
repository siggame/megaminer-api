import { setupApplication } from "./utils/setup";
import { properties } from "./utils/properties";
import { logger } from "./utils/logger";
import { app } from "./routes/index";

// Setup the application before starting the server
const setupPromise = setupApplication();

setupPromise
  .then(() => {
    // Start the application server
    const server = app.listen(properties.server.port);

    server.on("listening", () => {
      logger.info(`Listening on port ${properties.server.port}.`);
    });

    server.on("error", (error) => {
      logger.error(`Error starting server: ${error.message}`);

      server.close(() => {
        process.exit(1);
      });
    });
  })
  .catch((err) => {
    logger.error(`Failed to set up the application: ${err}`);
    process.exit(1);
  });
