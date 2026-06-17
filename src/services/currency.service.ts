import { CurrencyRepository } from '../repositories/currency.repository';
import { Currency } from '../types';
import { BadRequestError, NotFoundError } from '../utils/errors';

export class CurrencyService {
  constructor(private repo: CurrencyRepository) {}

  create(data: { ticker?: string; name?: string }): Currency {
    if (!data.ticker || !data.name) {
      throw new BadRequestError('ticker and name are required');
    }
    return this.repo.create(data.ticker.toUpperCase(), data.name);
  }

  getAll(): Currency[] {
    return this.repo.findAll();
  }

  getOne(id: number): Currency {
    const currency = this.repo.findOne(id);
    if (!currency) throw new NotFoundError(`Currency with id ${id} not found`);
    return currency;
  }

  update(id: number, data: { ticker?: string; name?: string }): Currency {
    if (!data.ticker && !data.name) {
      throw new BadRequestError('At least one of ticker or name must be provided');
    }
    const currency = this.repo.findOne(id);
    if (!currency) throw new NotFoundError(`Currency with id ${id} not found`);

    const ticker = data.ticker ? data.ticker.toUpperCase() : undefined;
    return this.repo.update(id, { ticker, name: data.name });
  }

  delete(id: number): Currency {
    const currency = this.repo.findOne(id);
    if (!currency) throw new NotFoundError(`Currency with id ${id} not found`);
    return this.repo.delete(id);
  }
}
