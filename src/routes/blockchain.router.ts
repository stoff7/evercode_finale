import { Router } from 'express';
import { BlockchainController } from '../controllers/blockchain.controller';

export function createBlockchainRouter(controller: BlockchainController): Router {
  const router = Router();

  /**
   * @openapi
   * /blockchain/height:
   *   get:
   *     summary: Get current blockchain height
   *     tags: [Blockchain]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: network
   *         schema:
   *           type: string
   *           enum: [btc, eth]
   *           default: btc
   *     responses:
   *       200:
   *         description: Current block height
   *       400:
   *         description: Unsupported network
   */
  router.get('/height', controller.getBlockHeight);

  return router;
}
