import Database from 'better-sqlite3';
import { Wallet } from '../types';

export class WalletRepository {
  private findById = this.db.prepare<[number], Wallet>('SELECT * FROM wallets WHERE id = ?');

  constructor(private db: Database.Database) {}

  create(address: string, network: string, label?: string): Wallet {
    const insert = this.db.prepare('INSERT INTO wallets (address, network, label) VALUES (?, ?, ?)');

    const run = this.db.transaction((a: string, n: string, l: string | null) => {
      const result = insert.run(a, n, l ?? null);
      return this.findById.get(result.lastInsertRowid as number) as Wallet;
    });

    return run(address, network, label ?? null);
  }

  findAll(): Wallet[] {
    return this.db.prepare<[], Wallet>('SELECT * FROM wallets').all();
  }

  findOne(id: number): Wallet | undefined {
    return this.findById.get(id);
  }

  findByAddress(address: string): Wallet | undefined {
    return this.db.prepare<[string], Wallet>('SELECT * FROM wallets WHERE address = ?').get(address);
  }

  update(id: number, data: Partial<Pick<Wallet, 'address' | 'network' | 'label'>>): Wallet {
    const update = this.db.prepare(
      'UPDATE wallets SET address = ?, network = ?, label = ? WHERE id = ?'
    );

    const run = this.db.transaction((id: number, data: Partial<Pick<Wallet, 'address' | 'network' | 'label'>>) => {
      const current = this.findById.get(id) as Wallet;
      update.run(
        data.address ?? current.address,
        data.network ?? current.network,
        data.label ?? current.label,
        id,
      );
      return this.findById.get(id) as Wallet;
    });

    return run(id, data);
  }

  delete(id: number): Wallet {
    const remove = this.db.prepare('DELETE FROM wallets WHERE id = ?');

    const run = this.db.transaction((id: number) => {
      const current = this.findById.get(id) as Wallet;
      remove.run(id);
      return current;
    });

    return run(id);
  }
}
