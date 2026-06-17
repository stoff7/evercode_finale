import { Request, Response } from 'express';
import { PriceService } from '../services/price.service';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export class PriceController {
  constructor(private service: PriceService) {}

  getPrice = (req: Request, res: Response): void => {
    try {
      const { ticker } = req.params as { ticker: string };
      logger.info(`GET /prices/${ticker}`);
      res.json(this.service.getPrice(ticker));
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  getHistory = (req: Request, res: Response): void => {
    try {
      const { ticker } = req.params as { ticker: string };
      const limit = req.query['limit'] ? Number(req.query['limit']) : undefined;
      logger.info(`GET /prices/${ticker}/history`);
      res.json(this.service.getHistory(ticker, limit));
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };
}
