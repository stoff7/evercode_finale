import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import { AppError } from './utils/errors';
import logger from './utils/logger';

export function createApp(router: express.Router, swaggerDoc?: object): express.Application {
  const app = express();

  app.use(express.json());

  if (swaggerDoc) {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  }

  app.use('/', router);

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      logger.error(`${err.code}: ${err.message}`);
      res.status(err.statusCode).json({ error: err.message, code: err.code });
      return;
    }
    logger.error(`Unhandled error: ${String(err)}`);
    res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
  });

  return app;
}
