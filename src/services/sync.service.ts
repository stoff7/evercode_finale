import { CurrencyRepository } from '../repositories/currency.repository';
import { PriceRepository } from '../repositories/price.repository';
import { SchedulerRepository } from '../repositories/scheduler.repository';
import { fetchWithRetry } from '../utils/fetch';
import logger from '../utils/logger';

interface BinancePrice {
  symbol: string;
  price: string;
}

export class SyncService {
  constructor(
    private currencyRepo: CurrencyRepository,
    private priceRepo: PriceRepository,
    private schedulerRepo: SchedulerRepository,
  ) {}

  async syncPrices(): Promise<void> {
    const log = this.schedulerRepo.createLog('price-sync');

    try {
      const currencies = this.currencyRepo.findAll();

      if (!currencies.length) {
        logger.debug('No currencies to sync');
        this.schedulerRepo.updateLog(log.id, 'success');
        return;
      }

      const allPrices = await fetchWithRetry<BinancePrice[]>(
        `${process.env['BINANCE_API'] ?? 'https://api.binance.com/api/v3'}/ticker/price`,
      );

      let updated = 0;

      for (const currency of currencies) {
        const matches = allPrices.filter((p) =>
          p.symbol.startsWith(currency.ticker) && p.symbol.endsWith('USDT')
        );

        for (const match of matches) {
          this.priceRepo.upsertPrice(currency.id, match.price);
          updated++;
        }
      }

      logger.info(`Price sync complete: ${updated} pairs updated`);
      this.schedulerRepo.updateLog(log.id, 'success');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Price sync failed: ${message}`);
      this.schedulerRepo.updateLog(log.id, 'error', message);
      throw error;
    }
  }
}
