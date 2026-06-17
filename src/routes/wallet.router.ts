import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';

export function createWalletRouter(controller: WalletController): Router {
  const router = Router();

  /**
   * @openapi
   * /wallets:
   *   get:
   *     summary: Get all wallets
   *     tags: [Wallets]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of wallets
   *   post:
   *     summary: Add a wallet
   *     tags: [Wallets]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [address, network]
   *             properties:
   *               address:
   *                 type: string
   *               network:
   *                 type: string
   *                 enum: [btc, eth]
   *               label:
   *                 type: string
   *     responses:
   *       201:
   *         description: Created wallet
   *       400:
   *         description: Validation error
   */
  router.get('/', controller.getAll);
  router.post('/', controller.create);

  /**
   * @openapi
   * /wallets/{id}:
   *   get:
   *     summary: Get wallet by id
   *     tags: [Wallets]
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
   *         description: Wallet object
   *       404:
   *         description: Not found
   *   put:
   *     summary: Update wallet
   *     tags: [Wallets]
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
   *         description: Updated wallet
   *   delete:
   *     summary: Delete wallet
   *     tags: [Wallets]
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
