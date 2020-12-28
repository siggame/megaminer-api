import { connect } from 'mongoose';

import { properties } from './properties';

/**
 * Run any functions required to start running the application server.
 */
export async function setupApplication() {
  await connect(properties.database.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
}