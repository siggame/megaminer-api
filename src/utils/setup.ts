import * as mongoose from "mongoose";

import { properties } from "./properties";

/**
 * Run any functions required to start running the application server.
 */
export async function setupApplication() {
  mongoose.set("useCreateIndex", true);

  await mongoose.connect(properties.database.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

/**
 * Run any functions required to tear down the application after stopping the server.
 */
export async function teardownApplication() {
  mongoose.disconnect();
}
