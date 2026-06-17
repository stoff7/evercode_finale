import { PriceRepository } from '../repositories/price.repository';
import { CurrencyRepository } from '../repositories/currency.repository';
import { Price, PriceHistory } from '../types';
import { NotFoundError } from '../utils/errors';

export class PriceService {
  constructor(
    private priceRepo: PriceRepository,
    private currencyRepo: CurrencyRepository,
  ) {}

  getPrice(ticker: string): Price {
    const currency = this.currencyRepo.findByTicker(ticker.toUpperCase());
    if (!currency) throw new NotFoundError(`Currency ${ticker.toUpperCase()} not found`);

    const price = this.priceRepo.findByCurrencyId(currency.id);
    if (!price) throw new NotFoundError(`No price data for ${ticker.toUpperCase()} yet`);

    return price;
  }

  getHistory(ticker: string, limit?: number): PriceHistory[] {
    const currency = this.currencyRepo.findByTicker(ticker.toUpperCase());
    if (!currency) throw new NotFoundError(`Currency ${ticker.toUpperCase()} not found`);

    return this.priceRepo.findHistoryByCurrencyId(currency.id, limit);
  }
}
