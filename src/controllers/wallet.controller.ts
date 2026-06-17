import { Request, Response } from 'express';
import { WalletService } from '../services/wallet.service';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export class WalletController {
  constructor(private service: WalletService) {}

  create = (req: Request, res: Response): void => {
    try {
      logger.info(`POST /wallets body=${JSON.stringify(req.body)}`);
      const wallet = this.service.create(req.body);
      res.status(201).json(wallet);
    } catch (error) {
      const err = error as AppError;
      logger.error(`Error creating wallet: ${err.message}`);
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  getAll = (_req: Request, res: Response): void => {
    try {
      res.json(this.service.getAll());
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  getOne = (req: Request, res: Response): void => {
    try {
      res.json(this.service.getOne(Number(req.params['id'])));
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  update = (req: Request, res: Response): void => {
    try {
      logger.info(`PUT /wallets/${req.params['id']} body=${JSON.stringify(req.body)}`);
      res.json(this.service.update(Number(req.params['id']), req.body));
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  delete = (req: Request, res: Response): void => {
    try {
      logger.info(`DELETE /wallets/${req.params['id']}`);
      this.service.delete(Number(req.params['id']));
      res.status(204).send();
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };
}
