import Database from 'better-sqlite3';
import { WalletRepository } from '../src/repositories/wallet.repository';
import { initDatabase } from '../src/db/init';

let db: Database.Database;
let repo: WalletRepository;

beforeEach(() => {
  db = new Database(':memory:');
  initDatabase(db);
  repo = new WalletRepository(db);
});

afterEach(() => db.close());

describe('WalletRepository', () => {
  it('creates and returns wallet', () => {
    const w = repo.create('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', 'btc', 'Genesis');
    expect(w.id).toBeDefined();
    expect(w.address).toBe('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf');
    expect(w.network).toBe('btc');
    expect(w.label).toBe('Genesis');
  });

  it('creates wallet without label', () => {
    const w = repo.create('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', 'btc');
    expect(w.label).toBeNull();
  });

  it('findAll returns all wallets', () => {
    repo.create('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', 'btc');
    repo.create('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'eth');
    expect(repo.findAll()).toHaveLength(2);
  });

  it('findOne returns wallet by id', () => {
    const created = repo.create('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', 'btc');
    expect(repo.findOne(created.id)?.network).toBe('btc');
  });

  it('findOne returns undefined for missing id', () => {
    expect(repo.findOne(999)).toBeUndefined();
  });

  it('update changes only provided fields', () => {
    const created = repo.create('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', 'btc');
    const updated = repo.update(created.id, { label: 'My wallet' });
    expect(updated.address).toBe(created.address);
    expect(updated.label).toBe('My wallet');
  });

  it('delete removes wallet and returns it', () => {
    const created = repo.create('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', 'btc');
    const deleted = repo.delete(created.id);
    expect(deleted.address).toBe(created.address);
    expect(repo.findOne(created.id)).toBeUndefined();
  });
});
