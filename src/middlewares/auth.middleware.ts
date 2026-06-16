import { Request, Response, NextFunction } from 'express';
import { ApiKeyRepository } from '../repositories/apiKey.repository';
import logger from '../utils/logger';

export function createAuthMiddleware(apiKeyRepository: ApiKeyRepository) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn('Missing or malformed Authorization header');
      res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
      return;
    }

    const key = authHeader.slice(7);
    const apiKey = apiKeyRepository.findByKey(key);

    if (!apiKey) {
      logger.warn(`Invalid API key attempt`);
      res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
      return;
    }

    logger.debug(`Authenticated with key: ${apiKey.name}`);
    next();
  };
}
