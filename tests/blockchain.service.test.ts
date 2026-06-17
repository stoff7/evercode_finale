import { BlockchainService } from '../src/services/blockchain.service';
import * as fetchModule from '../src/utils/fetch';

let service: BlockchainService;

beforeEach(() => {
  jest.clearAllMocks();
  service = new BlockchainService();
});

describe('BlockchainService', () => {
  describe('getBlockHeight', () => {
    it('throws 400 for unsupported network', async () => {
      await expect(service.getBlockHeight('sol')).rejects.toThrow('Unsupported network');
    });

    it('returns BTC block height', async () => {
      jest.spyOn(fetchModule, 'fetchWithRetry').mockResolvedValue(840000);
      const result = await service.getBlockHeight('btc');
      expect(result).toEqual({ network: 'btc', height: 840000 });
    });

    it('returns ETH block height parsed from hex', async () => {
      jest.spyOn(fetchModule, 'fetchWithRetry').mockResolvedValue({ status: '1', result: '0x12B4567' });
      const result = await service.getBlockHeight('eth');
      expect(result.network).toBe('eth');
      expect(result.height).toBe(parseInt('0x12B4567', 16));
    });

    it('is case-insensitive for network param', async () => {
      jest.spyOn(fetchModule, 'fetchWithRetry').mockResolvedValue(840000);
      const result = await service.getBlockHeight('BTC');
      expect(result.network).toBe('btc');
    });
  });

  describe('getWalletBalance', () => {
    it('throws 400 for unsupported network', async () => {
      await expect(service.getWalletBalance('addr', 'sol')).rejects.toThrow('Unsupported network');
    });

    it('returns BTC balance in BTC', async () => {
      jest.spyOn(fetchModule, 'fetchWithRetry').mockResolvedValue({
        '1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf': { final_balance: 100_000_000 },
      });
      const result = await service.getWalletBalance('1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf', 'btc');
      expect(result.balance).toBe('1.00000000');
      expect(result.unit).toBe('BTC');
    });

    it('returns ETH balance in ETH', async () => {
      jest.spyOn(fetchModule, 'fetchWithRetry').mockResolvedValue({ status: '1', result: '1000000000000000000' });
      const result = await service.getWalletBalance('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'eth');
      expect(result.balance).toBe('1.00000000');
      expect(result.unit).toBe('ETH');
    });
  });
});
