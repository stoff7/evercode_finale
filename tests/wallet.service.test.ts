import { WalletService } from '../src/services/wallet.service';
import { WalletRepository } from '../src/repositories/wallet.repository';
import { Wallet } from '../src/types';

const mockWallet: Wallet = {
  id: 1,
  address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf',
  network: 'btc',
  label: null,
  created_at: '',
};

const mockRepo = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByAddress: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
} as unknown as WalletRepository;

let service: WalletService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new WalletService(mockRepo);
});

describe('WalletService', () => {
  describe('create', () => {
    it('throws 400 if address missing', () => {
      expect(() => service.create({ network: 'btc' })).toThrow('address and network are required');
    });

    it('throws 400 if network missing', () => {
      expect(() => service.create({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf' })).toThrow('address and network are required');
    });

    it('throws 400 for unsupported network', () => {
      expect(() => service.create({ address: 'abc', network: 'sol' })).toThrow('Unsupported network');
    });

    it('throws 400 for invalid BTC address', () => {
      expect(() => service.create({ address: 'invalid', network: 'btc' })).toThrow('Invalid BTC address');
    });

    it('throws 400 for invalid ETH address', () => {
      expect(() => service.create({ address: 'invalid', network: 'eth' })).toThrow('Invalid ETH address');
    });

    it('creates wallet with valid BTC address', () => {
      (mockRepo.create as jest.Mock).mockReturnValue(mockWallet);
      const result = service.create({ address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', network: 'btc' });
      expect(result).toEqual(mockWallet);
    });

    it('creates wallet with valid ETH address', () => {
      const ethWallet = { ...mockWallet, address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', network: 'eth' };
      (mockRepo.create as jest.Mock).mockReturnValue(ethWallet);
      const result = service.create({ address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', network: 'eth' });
      expect(result.network).toBe('eth');
    });
  });

  describe('getOne', () => {
    it('returns wallet by id', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(mockWallet);
      expect(service.getOne(1)).toEqual(mockWallet);
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

    it('throws 404 if wallet not found', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(undefined);
      expect(() => service.update(999, { label: 'x' })).toThrow('not found');
    });
  });

  describe('delete', () => {
    it('throws 404 if not found', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(undefined);
      expect(() => service.delete(999)).toThrow('not found');
    });

    it('deletes and returns wallet', () => {
      (mockRepo.findOne as jest.Mock).mockReturnValue(mockWallet);
      (mockRepo.delete as jest.Mock).mockReturnValue(mockWallet);
      expect(service.delete(1)).toEqual(mockWallet);
    });
  });
});
