import { transports, Logger, createLogger, format } from 'winston';

// Create a new logger for the application using the config properties
export const logger: Logger = createLogger({
  transports: [
    new transports.Console({
      level: "debug",
      handleExceptions: true
    })
  ],
  exitOnError: false,
  format: format.combine(format.json(), format.prettyPrint())
});

// Output stream used by morgan, the HTTP request logger
// Configure it to utilize our winston logger
export const stream = {
  write: (message: string, _encoding: string): void => {
    logger.info(message);
  }
};