import { createApp } from './app';
import { createDatabase } from './db/database';
import { ApiKeyRepository } from './repositories/apiKey.repository';
import { CurrencyRepository } from './repositories/currency.repository';
import { CurrencyService } from './services/currency.service';
import { CurrencyController } from './controllers/currency.controller';
import { createRouter } from './routes';
import { clearAllSchedulers } from './utils/scheduler';
import logger from './utils/logger';

const PORT = process.env['PORT'] ?? 3000;

const db = createDatabase();

const apiKeyRepository = new ApiKeyRepository(db);
const currencyRepository = new CurrencyRepository(db);

const currencyService = new CurrencyService(currencyRepository);

const currencyController = new CurrencyController(currencyService);

const router = createRouter(apiKeyRepository, currencyController);
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
