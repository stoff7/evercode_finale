import Database from 'better-sqlite3';
import { ApiKey } from '../types';

export class ApiKeyRepository {
  constructor(private db: Database.Database) {}

  findByKey(key: string): ApiKey | undefined {
    return this.db.prepare('SELECT * FROM api_keys WHERE key = ?').get(key) as ApiKey | undefined;
  }

  create(key: string, name: string): ApiKey {
    const insert = this.db.prepare('INSERT INTO api_keys (key, name) VALUES (?, ?)');
    const select = this.db.prepare('SELECT * FROM api_keys WHERE id = ?');

    const run = this.db.transaction((k: string, n: string) => {
      const result = insert.run(k, n);
      return select.get(result.lastInsertRowid) as ApiKey;
    });

    return run(key, name);
  }

  findAll(): ApiKey[] {
    return this.db.prepare('SELECT * FROM api_keys').all() as ApiKey[];
  }
}
