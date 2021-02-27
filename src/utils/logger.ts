import { createLogger, format, transports } from "winston";

// Create a new logger for the application using the config properties
export const logger = createLogger({
  exitOnError: false,
  handleExceptions: true,
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      level: "debug",
      handleExceptions: true,
    }),
  ],
});

// Output stream used by morgan, the HTTP request logger
// Configure it to utilize our winston logger
export const stream = {
  write: (message: string) => {
    logger.info(message);
  },
};
