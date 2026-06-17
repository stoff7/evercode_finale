import Database from 'better-sqlite3';
import { PriceRepository } from '../src/repositories/price.repository';
import { CurrencyRepository } from '../src/repositories/currency.repository';
import { initDatabase } from '../src/db/init';

let db: Database.Database;
let priceRepo: PriceRepository;
let currencyRepo: CurrencyRepository;
let currencyId: number;

beforeEach(() => {
  db = new Database(':memory:');
  initDatabase(db);
  priceRepo = new PriceRepository(db);
  currencyRepo = new CurrencyRepository(db);
  const currency = currencyRepo.create('BTC', 'Bitcoin');
  currencyId = currency.id;
});

afterEach(() => db.close());

describe('PriceRepository', () => {
  it('upserts price and returns it', () => {
    const price = priceRepo.upsertPrice(currencyId, '50000.00');
    expect(price.currency_id).toBe(currencyId);
    expect(price.price).toBe('50000.00');
  });

  it('updates price on second upsert', () => {
    priceRepo.upsertPrice(currencyId, '50000.00');
    const updated = priceRepo.upsertPrice(currencyId, '55000.00');
    expect(updated.price).toBe('55000.00');
  });

  it('saves each upsert to price_history', () => {
    priceRepo.upsertPrice(currencyId, '50000.00');
    priceRepo.upsertPrice(currencyId, '51000.00');
    const history = priceRepo.findHistoryByCurrencyId(currencyId);
    expect(history).toHaveLength(2);
  });

  it('findByCurrencyId returns undefined if no price', () => {
    expect(priceRepo.findByCurrencyId(currencyId)).toBeUndefined();
  });

  it('findHistoryByCurrencyId respects limit', () => {
    for (let i = 0; i < 5; i++) priceRepo.upsertPrice(currencyId, `${i}000`);
    const history = priceRepo.findHistoryByCurrencyId(currencyId, 3);
    expect(history).toHaveLength(3);
  });
});
