import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';
import { createCurrencyRouter } from './currency.router';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { ApiKeyRepository } from '../repositories/apiKey.repository';
import logger from '../utils/logger';

export function createRouter(
  apiKeyRepository: ApiKeyRepository,
  currencyController: CurrencyController,
): Router {
  const router = Router();
  const auth = createAuthMiddleware(apiKeyRepository);

  router.get('/status', (_req, res) => {
    logger.info('GET /status');
    res.status(200).json({ status: 'ok' });
  });

  router.use('/currencies', auth, createCurrencyRouter(currencyController));

  return router;
}
