import { SyncService } from '../src/services/sync.service';
import { CurrencyRepository } from '../src/repositories/currency.repository';
import { PriceRepository } from '../src/repositories/price.repository';
import { SchedulerRepository } from '../src/repositories/scheduler.repository';
import { Currency, SchedulerLog } from '../src/types';
import * as fetchModule from '../src/utils/fetch';

const mockCurrency: Currency = { id: 1, ticker: 'BTC', name: 'Bitcoin', created_at: '' };
const mockLog: SchedulerLog = { id: 1, task_name: 'price-sync', started_at: '', finished_at: null, status: 'running', error: null };

const mockCurrencyRepo = {
  findAll: jest.fn(),
} as unknown as CurrencyRepository;

const mockPriceRepo = {
  upsertPrice: jest.fn(),
} as unknown as PriceRepository;

const mockSchedulerRepo = {
  createLog: jest.fn(),
  updateLog: jest.fn(),
} as unknown as SchedulerRepository;

let service: SyncService;

beforeEach(() => {
  jest.clearAllMocks();
  (mockSchedulerRepo.createLog as jest.Mock).mockReturnValue(mockLog);
  service = new SyncService(mockCurrencyRepo, mockPriceRepo, mockSchedulerRepo);
});

describe('SyncService', () => {
  it('logs success when no currencies', async () => {
    (mockCurrencyRepo.findAll as jest.Mock).mockReturnValue([]);
    await service.syncPrices();
    expect(mockSchedulerRepo.createLog).toHaveBeenCalledWith('price-sync');
    expect(mockSchedulerRepo.updateLog).toHaveBeenCalledWith(1, 'success');
  });

  it('fetches prices and upserts matching pairs', async () => {
    (mockCurrencyRepo.findAll as jest.Mock).mockReturnValue([mockCurrency]);
    jest.spyOn(fetchModule, 'fetchWithRetry').mockResolvedValue([
      { symbol: 'BTCUSDT', price: '50000.00' },
      { symbol: 'ETHUSDT', price: '3000.00' },
    ]);

    await service.syncPrices();

    expect(mockPriceRepo.upsertPrice).toHaveBeenCalledWith(1, '50000.00');
    expect(mockPriceRepo.upsertPrice).toHaveBeenCalledTimes(1);
    expect(mockSchedulerRepo.updateLog).toHaveBeenCalledWith(1, 'success');
  });

  it('logs error and rethrows on failure', async () => {
    (mockCurrencyRepo.findAll as jest.Mock).mockImplementation(() => {
      throw new Error('DB error');
    });

    await expect(service.syncPrices()).rejects.toThrow('DB error');
    expect(mockSchedulerRepo.updateLog).toHaveBeenCalledWith(1, 'error', 'DB error');
  });

  it('logs error when fetch fails', async () => {
    (mockCurrencyRepo.findAll as jest.Mock).mockReturnValue([mockCurrency]);
    jest.spyOn(fetchModule, 'fetchWithRetry').mockRejectedValue(new Error('Network error'));

    await expect(service.syncPrices()).rejects.toThrow('Network error');
    expect(mockSchedulerRepo.updateLog).toHaveBeenCalledWith(1, 'error', 'Network error');
  });
});
