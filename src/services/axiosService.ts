import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { logger } from "../utils/logger";

export async function axiosCall(
  config: AxiosRequestConfig,
  ignoreErrors: boolean = false
): Promise<AxiosResponse> {
  return axios(config).catch((err) => {
    if (ignoreErrors) {
      throw err;
    }

    if (err.response) {
      logger.error(
        `Axios Error Response: ${err.response.status} - ${JSON.stringify(
          err.response.data
        )}`
      );
    } else {
      logger.error(`Axios Call ${err}`);
    }

    throw err;
  });
}
