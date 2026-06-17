import { PriceService } from '../src/services/price.service';
import { PriceRepository } from '../src/repositories/price.repository';
import { CurrencyRepository } from '../src/repositories/currency.repository';
import { Currency, Price, PriceHistory } from '../src/types';

const mockCurrency: Currency = { id: 1, ticker: 'BTC', name: 'Bitcoin', created_at: '' };
const mockPrice: Price = { id: 1, currency_id: 1, price: '50000.00', updated_at: '' };
const mockHistory: PriceHistory[] = [
  { id: 1, currency_id: 1, price: '50000.00', recorded_at: '' },
];

const mockPriceRepo = {
  findByCurrencyId: jest.fn(),
  findHistoryByCurrencyId: jest.fn(),
  upsertPrice: jest.fn(),
} as unknown as PriceRepository;

const mockCurrencyRepo = {
  findByTicker: jest.fn(),
} as unknown as CurrencyRepository;

let service: PriceService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new PriceService(mockPriceRepo, mockCurrencyRepo);
});

describe('PriceService', () => {
  describe('getPrice', () => {
    it('returns price for known ticker', () => {
      (mockCurrencyRepo.findByTicker as jest.Mock).mockReturnValue(mockCurrency);
      (mockPriceRepo.findByCurrencyId as jest.Mock).mockReturnValue(mockPrice);
      expect(service.getPrice('btc')).toEqual(mockPrice);
      expect(mockCurrencyRepo.findByTicker).toHaveBeenCalledWith('BTC');
    });

    it('throws 404 if currency not found', () => {
      (mockCurrencyRepo.findByTicker as jest.Mock).mockReturnValue(undefined);
      expect(() => service.getPrice('UNKNOWN')).toThrow('not found');
    });

    it('throws 404 if no price data yet', () => {
      (mockCurrencyRepo.findByTicker as jest.Mock).mockReturnValue(mockCurrency);
      (mockPriceRepo.findByCurrencyId as jest.Mock).mockReturnValue(undefined);
      expect(() => service.getPrice('BTC')).toThrow('No price data');
    });
  });

  describe('getHistory', () => {
    it('returns history for known ticker', () => {
      (mockCurrencyRepo.findByTicker as jest.Mock).mockReturnValue(mockCurrency);
      (mockPriceRepo.findHistoryByCurrencyId as jest.Mock).mockReturnValue(mockHistory);
      expect(service.getHistory('btc')).toEqual(mockHistory);
    });

    it('throws 404 if currency not found', () => {
      (mockCurrencyRepo.findByTicker as jest.Mock).mockReturnValue(undefined);
      expect(() => service.getHistory('UNKNOWN')).toThrow('not found');
    });

    it('passes limit to repository', () => {
      (mockCurrencyRepo.findByTicker as jest.Mock).mockReturnValue(mockCurrency);
      (mockPriceRepo.findHistoryByCurrencyId as jest.Mock).mockReturnValue([]);
      service.getHistory('BTC', 10);
      expect(mockPriceRepo.findHistoryByCurrencyId).toHaveBeenCalledWith(1, 10);
    });
  });
});
