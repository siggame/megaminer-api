const configsPath = '../../configs'

/**
 * Properties stores data from the application config files.
 */
class Properties{
  externalServices: any;
  logging: any;
  server: any;

  constructor() {
    this.server = require(`${configsPath}/serverConfig.json`);
  }
}

export const properties = new Properties();