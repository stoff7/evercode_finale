import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';
import { WalletController } from '../controllers/wallet.controller';
import { PriceController } from '../controllers/price.controller';
import { createCurrencyRouter } from './currency.router';
import { createWalletRouter } from './wallet.router';
import { createPriceRouter } from './price.router';
import { createAuthMiddleware } from '../middlewares/auth.middleware';
import { ApiKeyRepository } from '../repositories/apiKey.repository';
import logger from '../utils/logger';

export function createRouter(
  apiKeyRepository: ApiKeyRepository,
  currencyController: CurrencyController,
  walletController: WalletController,
  priceController: PriceController,
): Router {
  const router = Router();
  const auth = createAuthMiddleware(apiKeyRepository);

  router.get('/status', (_req, res) => {
    logger.info('GET /status');
    res.status(200).json({ status: 'ok' });
  });

  router.use('/currencies', auth, createCurrencyRouter(currencyController));
  router.use('/wallets', auth, createWalletRouter(walletController));
  router.use('/prices', auth, createPriceRouter(priceController));

  return router;
}
