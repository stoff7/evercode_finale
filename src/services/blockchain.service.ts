import { fetchWithRetry } from '../utils/fetch';
import { BadRequestError } from '../utils/errors';

interface BlockchainInfoBalance {
  [address: string]: { final_balance: number };
}

interface EtherscanBalanceResponse {
  status: string;
  result: string;
}

interface EtherscanBlockResponse {
  status: string;
  result: string;
}

const SUPPORTED_NETWORKS = ['btc', 'eth'] as const;
type Network = typeof SUPPORTED_NETWORKS[number];

export class BlockchainService {
  async getBlockHeight(network: string): Promise<{ network: string; height: number }> {
    const net = network.toLowerCase() as Network;

    if (!SUPPORTED_NETWORKS.includes(net)) {
      throw new BadRequestError(`Unsupported network. Supported: ${SUPPORTED_NETWORKS.join(', ')}`);
    }

    if (net === 'btc') {
      const height = await fetchWithRetry<number>('https://blockchain.info/q/getblockcount');
      return { network: 'btc', height };
    }

    const apiKey = process.env['ETHERSCAN_API_KEY'] ?? '';
    const data = await fetchWithRetry<EtherscanBlockResponse>(
      `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${apiKey}`
    );
    const height = parseInt(data.result, 16);
    return { network: 'eth', height };
  }

  async getWalletBalance(address: string, network: string): Promise<{ address: string; network: string; balance: string; unit: string }> {
    const net = network.toLowerCase() as Network;

    if (!SUPPORTED_NETWORKS.includes(net)) {
      throw new BadRequestError(`Unsupported network. Supported: ${SUPPORTED_NETWORKS.join(', ')}`);
    }

    if (net === 'btc') {
      const data = await fetchWithRetry<BlockchainInfoBalance>(
        `https://blockchain.info/balance?active=${address}`
      );
      const satoshis = data[address]?.final_balance ?? 0;
      const btc = (satoshis / 1e8).toFixed(8);
      return { address, network: 'btc', balance: btc, unit: 'BTC' };
    }

    const apiKey = process.env['ETHERSCAN_API_KEY'] ?? '';
    const data = await fetchWithRetry<EtherscanBalanceResponse>(
      `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`
    );
    const eth = (parseInt(data.result, 10) / 1e18).toFixed(8);
    return { address, network: 'eth', balance: eth, unit: 'ETH' };
  }
}
