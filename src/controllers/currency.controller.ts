import { Request, Response } from 'express';
import { CurrencyService } from '../services/currency.service';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export class CurrencyController {
  constructor(private service: CurrencyService) {}

  create = (req: Request, res: Response): void => {
    try {
      logger.info(`POST /currencies body=${JSON.stringify(req.body)}`);
      const currency = this.service.create(req.body);
      res.status(201).json(currency);
    } catch (error) {
      const err = error as AppError;
      logger.error(`Error creating currency: ${err.message}`);
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  getAll = (_req: Request, res: Response): void => {
    try {
      const currencies = this.service.getAll();
      res.json(currencies);
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  getOne = (req: Request, res: Response): void => {
    try {
      const currency = this.service.getOne(Number(req.params['id']));
      res.json(currency);
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  update = (req: Request, res: Response): void => {
    try {
      logger.info(`PUT /currencies/${req.params['id']} body=${JSON.stringify(req.body)}`);
      const currency = this.service.update(Number(req.params['id']), req.body);
      res.json(currency);
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };

  delete = (req: Request, res: Response): void => {
    try {
      logger.info(`DELETE /currencies/${req.params['id']}`);
      this.service.delete(Number(req.params['id']));
      res.status(204).send();
    } catch (error) {
      const err = error as AppError;
      res.status(err.statusCode ?? 500).json({ error: err.message });
    }
  };
}
