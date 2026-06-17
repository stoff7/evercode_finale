import { WalletRepository } from '../repositories/wallet.repository';
import { Wallet } from '../types';
import { BadRequestError, NotFoundError } from '../utils/errors';

const SUPPORTED_NETWORKS = ['btc', 'eth'] as const;
type Network = typeof SUPPORTED_NETWORKS[number];

const ADDRESS_PATTERNS: Record<Network, RegExp> = {
  btc: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-zA-HJ-NP-Z0-9]{6,87}$/,
  eth: /^0x[a-fA-F0-9]{40}$/,
};

export class WalletService {
  constructor(private repo: WalletRepository) {}

  create(data: { address?: string; network?: string; label?: string }): Wallet {
    if (!data.address || !data.network) {
      throw new BadRequestError('address and network are required');
    }

    const network = data.network.toLowerCase() as Network;

    if (!SUPPORTED_NETWORKS.includes(network)) {
      throw new BadRequestError(`Unsupported network. Supported: ${SUPPORTED_NETWORKS.join(', ')}`);
    }

    const pattern = ADDRESS_PATTERNS[network];
    if (!pattern.test(data.address)) {
      throw new BadRequestError(`Invalid ${network.toUpperCase()} address format`);
    }

    return this.repo.create(data.address, network, data.label);
  }

  getAll(): Wallet[] {
    return this.repo.findAll();
  }

  getOne(id: number): Wallet {
    const wallet = this.repo.findOne(id);
    if (!wallet) throw new NotFoundError(`Wallet with id ${id} not found`);
    return wallet;
  }

  update(id: number, data: { address?: string; network?: string; label?: string }): Wallet {
    if (!data.address && !data.network && !data.label) {
      throw new BadRequestError('At least one of address, network or label must be provided');
    }

    const wallet = this.repo.findOne(id);
    if (!wallet) throw new NotFoundError(`Wallet with id ${id} not found`);

    const network = (data.network?.toLowerCase() ?? wallet.network) as Network;

    if (data.network && !SUPPORTED_NETWORKS.includes(network)) {
      throw new BadRequestError(`Unsupported network. Supported: ${SUPPORTED_NETWORKS.join(', ')}`);
    }

    const address = data.address ?? wallet.address;
    const pattern = ADDRESS_PATTERNS[network];
    if (data.address && !pattern.test(address)) {
      throw new BadRequestError(`Invalid ${network.toUpperCase()} address format`);
    }

    return this.repo.update(id, { address: data.address, network: data.network?.toLowerCase(), label: data.label });
  }

  delete(id: number): Wallet {
    const wallet = this.repo.findOne(id);
    if (!wallet) throw new NotFoundError(`Wallet with id ${id} not found`);
    return this.repo.delete(id);
  }
}
