import * as mongoose from "mongoose";
import { logger } from "./logger";

import { properties } from "./properties";

/**
 * Run any functions required to start running the application server.
 */
export async function setupApplication() {
  mongoose.set("useCreateIndex", true);

  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  const persistentConnect = () =>
    mongoose
      .connect(properties.database.mongoUri, mongooseOptions)
      .catch((err) => {
        logger.error(err);
        logger.error("Failed to connect to database, retrying in 5 seconds...");
        setTimeout(persistentConnect, 5000);
      });

  persistentConnect();

  mongoose.connection.on("error", (err) => {
    logger.error(err);
  })
}

/**
 * Run any functions required to tear down the application after stopping the server.
 */
export async function teardownApplication() {
  mongoose.disconnect();
}
