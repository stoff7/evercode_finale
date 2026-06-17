import Database from 'better-sqlite3';
import { Currency } from '../types';

export class CurrencyRepository {
  private findById = this.db.prepare<[number], Currency>('SELECT * FROM currencies WHERE id = ?');

  constructor(private db: Database.Database) {}

  create(ticker: string, name: string): Currency {
    const insert = this.db.prepare('INSERT INTO currencies (ticker, name) VALUES (?, ?)');

    const run = this.db.transaction((t: string, n: string) => {
      const result = insert.run(t, n);
      return this.findById.get(result.lastInsertRowid as number) as Currency;
    });

    return run(ticker, name);
  }

  findAll(): Currency[] {
    return this.db.prepare<[], Currency>('SELECT * FROM currencies').all();
  }

  findOne(id: number): Currency | undefined {
    return this.findById.get(id);
  }

  findByTicker(ticker: string): Currency | undefined {
    return this.db.prepare<[string], Currency>('SELECT * FROM currencies WHERE ticker = ?').get(ticker);
  }

  update(id: number, data: Partial<Pick<Currency, 'ticker' | 'name'>>): Currency {
    const update = this.db.prepare(
      'UPDATE currencies SET ticker = ?, name = ? WHERE id = ?'
    );

    const run = this.db.transaction((id: number, data: Partial<Pick<Currency, 'ticker' | 'name'>>) => {
      const current = this.findById.get(id) as Currency;
      update.run(data.ticker ?? current.ticker, data.name ?? current.name, id);
      return this.findById.get(id) as Currency;
    });

    return run(id, data);
  }

  delete(id: number): Currency {
    const remove = this.db.prepare('DELETE FROM currencies WHERE id = ?');

    const run = this.db.transaction((id: number) => {
      const current = this.findById.get(id) as Currency;
      remove.run(id);
      return current;
    });

    return run(id);
  }
}
