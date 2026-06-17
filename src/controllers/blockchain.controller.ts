import { Request, Response } from 'express';
import { BlockchainService } from '../services/blockchain.service';
import { WalletService } from '../services/wallet.service';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export class BlockchainController {
  constructor(
    private blockchainService: BlockchainService,
    private walletService: WalletService,
  ) {}

  getBlockHeight = async (req: Request, res: Response): Promise<void> => {
    try {
      const network = (req.query['network'] as string) ?? 'btc';
      logger.info(`GET /blockchain/height?network=${network}`);
      const result = await this.blockchainService.getBlockHeight(network);
      res.json(result);
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  getWalletBalance = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params['id']);
      logger.info(`GET /wallets/${id}/balance`);
      const wallet = this.walletService.getOne(id);
      const result = await this.blockchainService.getWalletBalance(wallet.address, wallet.network);
      res.json(result);
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };
}
