import Database from 'better-sqlite3';
import { CurrencyRepository } from '../src/repositories/currency.repository';
import { initDatabase } from '../src/db/init';

let db: Database.Database;
let repo: CurrencyRepository;

beforeEach(() => {
  db = new Database(':memory:');
  initDatabase(db);
  repo = new CurrencyRepository(db);
});

afterEach(() => db.close());

describe('CurrencyRepository', () => {
  it('creates and returns currency', () => {
    const c = repo.create('BTC', 'Bitcoin');
    expect(c.id).toBeDefined();
    expect(c.ticker).toBe('BTC');
    expect(c.name).toBe('Bitcoin');
  });

  it('findAll returns all currencies', () => {
    repo.create('BTC', 'Bitcoin');
    repo.create('ETH', 'Ethereum');
    expect(repo.findAll()).toHaveLength(2);
  });

  it('findOne returns currency by id', () => {
    const created = repo.create('BTC', 'Bitcoin');
    expect(repo.findOne(created.id)?.ticker).toBe('BTC');
  });

  it('findOne returns undefined for missing id', () => {
    expect(repo.findOne(999)).toBeUndefined();
  });

  it('update changes only provided fields', () => {
    const created = repo.create('BTC', 'Bitcoin');
    const updated = repo.update(created.id, { name: 'Bitcoin Updated' });
    expect(updated.ticker).toBe('BTC');
    expect(updated.name).toBe('Bitcoin Updated');
  });

  it('delete removes currency and returns it', () => {
    const created = repo.create('BTC', 'Bitcoin');
    const deleted = repo.delete(created.id);
    expect(deleted.ticker).toBe('BTC');
    expect(repo.findOne(created.id)).toBeUndefined();
  });
});
