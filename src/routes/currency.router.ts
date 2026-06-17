import { Router } from 'express';
import { CurrencyController } from '../controllers/currency.controller';

export function createCurrencyRouter(controller: CurrencyController): Router {
  const router = Router();

  /**
   * @openapi
   * /currencies:
   *   get:
   *     summary: Get all currencies
   *     tags: [Currencies]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of currencies
   *   post:
   *     summary: Create a currency
   *     tags: [Currencies]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [ticker, name]
   *             properties:
   *               ticker:
   *                 type: string
   *                 example: BTC
   *               name:
   *                 type: string
   *                 example: Bitcoin
   *     responses:
   *       201:
   *         description: Created currency
   *       400:
   *         description: Validation error
   */
  router.get('/', controller.getAll);
  router.post('/', controller.create);

  /**
   * @openapi
   * /currencies/{id}:
   *   get:
   *     summary: Get currency by id
   *     tags: [Currencies]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Currency object
   *       404:
   *         description: Not found
   *   put:
   *     summary: Update currency
   *     tags: [Currencies]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               ticker:
   *                 type: string
   *               name:
   *                 type: string
   *     responses:
   *       200:
   *         description: Updated currency
   *   delete:
   *     summary: Delete currency
   *     tags: [Currencies]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Deleted
   */
  router.get('/:id', controller.getOne);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.delete);

  return router;
}
