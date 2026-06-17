import { Router } from 'express';
import { PriceController } from '../controllers/price.controller';

export function createPriceRouter(controller: PriceController): Router {
  const router = Router();

  /**
   * @openapi
   * /prices/{ticker}:
   *   get:
   *     summary: Get current price for a currency
   *     tags: [Prices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: ticker
   *         required: true
   *         schema:
   *           type: string
   *         example: BTC
   *     responses:
   *       200:
   *         description: Current price
   *       404:
   *         description: Currency or price not found
   */
  router.get('/:ticker', controller.getPrice);

  /**
   * @openapi
   * /prices/{ticker}/history:
   *   get:
   *     summary: Get price history for a currency
   *     tags: [Prices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: ticker
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Max records to return (default 100)
   *     responses:
   *       200:
   *         description: Price history array
   */
  router.get('/:ticker/history', controller.getHistory);

  return router;
}
