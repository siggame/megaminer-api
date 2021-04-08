const configsPath = "../..";

/**
 * Properties stores data from the application config files.
 */
class Properties {
  server: any;

  database: any;

  /**
   * Fetch and store all data from config files.
   */
  init(configsFolder: string) {
    this.server = require(`${configsPath}/${configsFolder}/serverConfig.json`);
    this.database = require(`${configsPath}/${configsFolder}/databaseConfig.json`);
  }
}

export const properties = new Properties();
