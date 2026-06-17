import Database from 'better-sqlite3';
import { Price, PriceHistory } from '../types';

export class PriceRepository {
  constructor(private db: Database.Database) {}

  upsertPrice(currencyId: number, price: string): Price {
    const upsert = this.db.prepare(`
      INSERT INTO prices (currency_id, price, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(currency_id) DO UPDATE SET
        price = excluded.price,
        updated_at = excluded.updated_at
    `);
    const insertHistory = this.db.prepare(
      'INSERT INTO price_history (currency_id, price) VALUES (?, ?)'
    );
    const selectPrice = this.db.prepare<[number], Price>(
      'SELECT * FROM prices WHERE currency_id = ?'
    );

    const run = this.db.transaction((currencyId: number, price: string) => {
      const now = new Date().toISOString();
      upsert.run(currencyId, price, now);
      insertHistory.run(currencyId, price);
      return selectPrice.get(currencyId) as Price;
    });

    return run(currencyId, price);
  }

  findByCurrencyId(currencyId: number): Price | undefined {
    return this.db.prepare<[number], Price>(
      'SELECT * FROM prices WHERE currency_id = ?'
    ).get(currencyId);
  }

  findHistoryByCurrencyId(currencyId: number, limit = 100): PriceHistory[] {
    return this.db.prepare<[number, number], PriceHistory>(
      'SELECT * FROM price_history WHERE currency_id = ? ORDER BY recorded_at DESC LIMIT ?'
    ).all(currencyId, limit);
  }
}
