import { connect } from 'mongoose'

import { properties } from './utils/configs';
import { logger } from './utils/logger';
import { app } from './routes/index';

await connect(properties.database.mongoUri)

// Tell our app to listen on our configured port
const server = app.listen(properties.server.port);

/**
 * Event listener for when the server begins listening.
 */
server.on('listening', () => {
  logger.info(`Listening on port ${properties.server.port}.`);
});

/**
 * Event listener for when the server encounters an error.
 */
server.on('error', (error: any) => {
  logger.error(`Error starting server: ${error.message}`);
  
  server.close(() => {
    process.exit(1);
  });
});