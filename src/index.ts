import { createApp } from './app';
import { createDatabase } from './db/database';
import { ApiKeyRepository } from './repositories/apiKey.repository';
import { CurrencyRepository } from './repositories/currency.repository';
import { WalletRepository } from './repositories/wallet.repository';
import { PriceRepository } from './repositories/price.repository';
import { CurrencyService } from './services/currency.service';
import { WalletService } from './services/wallet.service';
import { PriceService } from './services/price.service';
import { CurrencyController } from './controllers/currency.controller';
import { WalletController } from './controllers/wallet.controller';
import { PriceController } from './controllers/price.controller';
import { createRouter } from './routes';
import { clearAllSchedulers } from './utils/scheduler';
import logger from './utils/logger';

const PORT = process.env['PORT'] ?? 3000;

const db = createDatabase();

const apiKeyRepository = new ApiKeyRepository(db);
const currencyRepository = new CurrencyRepository(db);
const walletRepository = new WalletRepository(db);
const priceRepository = new PriceRepository(db);

const currencyService = new CurrencyService(currencyRepository);
const walletService = new WalletService(walletRepository);
const priceService = new PriceService(priceRepository, currencyRepository);

const currencyController = new CurrencyController(currencyService);
const walletController = new WalletController(walletService);
const priceController = new PriceController(priceService);

const router = createRouter(apiKeyRepository, currencyController, walletController, priceController);
const app = createApp(router);

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

function shutdown(signal: string): void {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  clearAllSchedulers();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
