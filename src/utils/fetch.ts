import axios, { AxiosRequestConfig } from 'axios';
import { ExternalApiError, TimeoutError } from './errors';
import logger from './logger';

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY_MS = 500;

export async function fetchWithRetry<T>(
  url: string,
  config: AxiosRequestConfig = {},
  retries = DEFAULT_RETRIES,
  retryDelay = DEFAULT_RETRY_DELAY_MS,
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get<T>(url, {
        timeout: DEFAULT_TIMEOUT_MS,
        ...config,
      });
      return response.data;
    } catch (error: unknown) {
      const isLast = attempt === retries;

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          logger.warn(`Attempt ${attempt}/${retries} timed out: ${url}`);
          if (isLast) throw new TimeoutError(`Request timed out after ${retries} attempts: ${url}`);
        } else {
          logger.warn(`Attempt ${attempt}/${retries} failed: ${error.message}`);
          if (isLast) throw new ExternalApiError(`External API unavailable after ${retries} attempts: ${url}`);
        }
      } else {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, retryDelay * attempt));
    }
  }

  throw new ExternalApiError(`External API unavailable: ${url}`);
}
