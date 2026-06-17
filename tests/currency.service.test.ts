import { CurrencyService } from '../src/services/currency.service';
import { CurrencyRepository } from '../src/repositories/currency.repository';
import { Currency } from '../src/types';

const mockCurrency: Currency = { id: 1, ticker: 'BTC', name: 'Bitcoin', created_at: '' };

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByTicker: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as CurrencyRepository;

let service: CurrencyService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new CurrencyService(mockRepo);
});

describe('CurrencyService', () => {
  describe('create', () => {
    it('creates currency with uppercased ticker', () => {
      (mockRepo.create as jest.Mock).mockReturnValue(mockCurrency);
      const result = service.create({ ticker: 'btc', name: 'Bitcoin' });
      expect(mockRepo.create).toHaveBeenCalledWith('BTC', 'Bitcoin');
      expect(result).toEqual(mockCurrency);
    });

    it('throws 400 if ticker missing', () => {
      expect(() => service.create({ name: 'Bitcoin' })).toThrow('ticker and name are required');
    });

    it('throws 400 if name missing', () => {
      expect(() => service.create({ ticker: 'BTC' })).toThrow('ticker and name are required');
    });
  });

  describe('getOne', () => {
    it('returns currency by id', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(mockCurrency);
      expect(service.getOne(1)).toEqual(mockCurrency);
    });

    it('throws 404 if not found', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(undefined);
      expect(() => service.getOne(999)).toThrow('not found');
    });
  });

  describe('update', () => {
    it('throws 400 if no fields provided', () => {
      expect(() => service.update(1, {})).toThrow('At least one');
    });

    it('throws 404 if currency not found', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(undefined);
      expect(() => service.update(999, { name: 'X' })).toThrow('not found');
    });

    it('updates and returns currency', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(mockCurrency);
      (mockRepo.update as jest.Mock).mockReturnValue({ ...mockCurrency, name: 'Updated' });
      const result = service.update(1, { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });
  });

  describe('delete', () => {
    it('throws 404 if not found', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(undefined);
      expect(() => service.delete(999)).toThrow('not found');
    });

    it('deletes and returns currency', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(mockCurrency);
      (mockRepo.delete as jest.Mock).mockReturnValue(mockCurrency);
      expect(service.delete(1)).toEqual(mockCurrency);
    });
  });
});
