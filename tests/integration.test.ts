import request from 'supertest';
import http from 'http';
import Database from 'better-sqlite3';
import { createApp } from '../src/app';
import { initDatabase } from '../src/db/init';
import { ApiKeyRepository } from '../src/repositories/apiKey.repository';
import { CurrencyRepository } from '../src/repositories/currency.repository';
import { WalletRepository } from '../src/repositories/wallet.repository';
import { PriceRepository } from '../src/repositories/price.repository';
import { CurrencyService } from '../src/services/currency.service';
import { WalletService } from '../src/services/wallet.service';
import { PriceService } from '../src/services/price.service';
import { BlockchainService } from '../src/services/blockchain.service';
import { CurrencyController } from '../src/controllers/currency.controller';
import { WalletController } from '../src/controllers/wallet.controller';
import { PriceController } from '../src/controllers/price.controller';
import { BlockchainController } from '../src/controllers/blockchain.controller';
import { createRouter } from '../src/routes';
import * as fetchModule from '../src/utils/fetch';

let db: Database.Database;
let server: http.Server;
let apiKey: string;
let auth: string;

jest.mock('../src/utils/fetch');

beforeEach(() => {
  db = new Database(':memory:');
  initDatabase(db);

  const apiKeyRepo = new ApiKeyRepository(db);
  const currencyRepo = new CurrencyRepository(db);
  const walletRepo = new WalletRepository(db);
  const priceRepo = new PriceRepository(db);

  const created = apiKeyRepo.create('test-key-123', 'test');
  apiKey = created.key;
  auth = `Bearer ${apiKey}`;

  const currencyService = new CurrencyService(currencyRepo);
  const walletService = new WalletService(walletRepo);
  const priceService = new PriceService(priceRepo, currencyRepo);
  const blockchainService = new BlockchainService();

  const router = createRouter(
    apiKeyRepo,
    new CurrencyController(currencyService),
    new WalletController(walletService),
    new PriceController(priceService),
    new BlockchainController(blockchainService, walletService),
  );

  server = http.createServer(createApp(router));
});

afterEach(() => {
  db.close();
  server.close();
});

describe('GET /status', () => {
  it('returns 200 without auth', async () => {
    const res = await request(server).get('/status');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth middleware', () => {
  it('returns 401 without token', async () => {
    const res = await request(server).get('/currencies');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    const res = await request(server).get('/currencies').set('Authorization', 'Bearer invalid');
    expect(res.status).toBe(401);
  });
});

describe('Currencies', () => {
  it('POST /currencies — creates currency', async () => {
    const res = await request(server)
      .post('/currencies')
      .set('Authorization', auth)
      .send({ ticker: 'btc', name: 'Bitcoin' });
    expect(res.status).toBe(201);
    expect(res.body.ticker).toBe('BTC');
  });

  it('POST /currencies — 400 if ticker missing', async () => {
    const res = await request(server)
      .post('/currencies')
      .set('Authorization', auth)
      .send({ name: 'Bitcoin' });
    expect(res.status).toBe(400);
  });

  it('GET /currencies — returns list', async () => {
    await request(server).post('/currencies').set('Authorization', auth).send({ ticker: 'BTC', name: 'Bitcoin' });
    const res = await request(server).get('/currencies').set('Authorization', auth);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /currencies/:id — returns currency', async () => {
    const created = await request(server).post('/currencies').set('Authorization', auth).send({ ticker: 'BTC', name: 'Bitcoin' });
    const res = await request(server).get(`/currencies/${created.body.id}`).set('Authorization', auth);
    expect(res.status).toBe(200);
    expect(res.body.ticker).toBe('BTC');
  });

  it('GET /currencies/:id — 404 for missing', async () => {
    const res = await request(server).get('/currencies/999').set('Authorization', auth);
    expect(res.status).toBe(404);
  });

  it('PUT /currencies/:id — updates currency', async () => {
    const created = await request(server).post('/currencies').set('Authorization', auth).send({ ticker: 'BTC', name: 'Bitcoin' });
    const res = await request(server).put(`/currencies/${created.body.id}`).set('Authorization', auth).send({ name: 'Bitcoin Updated' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Bitcoin Updated');
  });

  it('DELETE /currencies/:id — deletes currency', async () => {
    const created = await request(server).post('/currencies').set('Authorization', auth).send({ ticker: 'BTC', name: 'Bitcoin' });
    const res = await request(server).delete(`/currencies/${created.body.id}`).set('Authorization', auth);
    expect(res.status).toBe(204);
  });

  it('DELETE /currencies/:id — 404 for missing', async () => {
    const res = await request(server).delete('/currencies/999').set('Authorization', auth);
    expect(res.status).toBe(404);
  });
});

describe('Wallets', () => {
  it('POST /wallets — creates wallet', async () => {
    const res = await request(server)
      .post('/wallets')
      .set('Authorization', auth)
      .send({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', network: 'btc', label: 'Genesis' });
    expect(res.status).toBe(201);
    expect(res.body.network).toBe('btc');
  });

  it('POST /wallets — 400 for invalid address', async () => {
    const res = await request(server)
      .post('/wallets')
      .set('Authorization', auth)
      .send({ address: 'invalid', network: 'btc' });
    expect(res.status).toBe(400);
  });

  it('GET /wallets — returns list', async () => {
    await request(server).post('/wallets').set('Authorization', auth).send({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', network: 'btc' });
    const res = await request(server).get('/wallets').set('Authorization', auth);
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET /wallets/:id — 404 for missing', async () => {
    const res = await request(server).get('/wallets/999').set('Authorization', auth);
    expect(res.status).toBe(404);
  });

  it('DELETE /wallets/:id — deletes wallet', async () => {
    const created = await request(server).post('/wallets').set('Authorization', auth).send({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', network: 'btc' });
    const res = await request(server).delete(`/wallets/${created.body.id}`).set('Authorization', auth);
    expect(res.status).toBe(204);
  });
});

describe('Prices', () => {
  it('GET /prices/:ticker — 404 if currency not found', async () => {
    const res = await request(server).get('/prices/UNKNOWN').set('Authorization', auth);
    expect(res.status).toBe(404);
  });

  it('GET /prices/:ticker — 404 if no price data yet', async () => {
    await request(server).post('/currencies').set('Authorization', auth).send({ ticker: 'BTC', name: 'Bitcoin' });
    const res = await request(server).get('/prices/BTC').set('Authorization', auth);
    expect(res.status).toBe(404);
  });

  it('GET /prices/:ticker/history — returns empty array initially', async () => {
    await request(server).post('/currencies').set('Authorization', auth).send({ ticker: 'BTC', name: 'Bitcoin' });
    const res = await request(server).get('/prices/BTC/history').set('Authorization', auth);
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('Blockchain', () => {
  it('GET /blockchain/height — 400 for unsupported network', async () => {
    const res = await request(server).get('/blockchain/height?network=sol').set('Authorization', auth);
    expect(res.status).toBe(400);
  });

  it('GET /blockchain/height — returns height for BTC', async () => {
    (fetchModule.fetchWithRetry as jest.Mock).mockResolvedValue(840000);
    const res = await request(server).get('/blockchain/height?network=btc').set('Authorization', auth);
    expect(res.status).toBe(200);
    expect(res.body.height).toBe(840000);
  });

  it('GET /wallets/:id/balance — 404 for missing wallet', async () => {
    const res = await request(server).get('/wallets/999/balance').set('Authorization', auth);
    expect(res.status).toBe(404);
  });
});
