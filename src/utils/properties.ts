const configsPath = "../../configs";

/**
 * Properties stores data from the application config files.
 */
class Properties {
  server: any;

  database: any;

  constructor() {
    this.server = require(`${configsPath}/serverConfig.json`);
    this.database = require(`${configsPath}/databaseConfig.json`);
  }
}

export const properties = new Properties();
