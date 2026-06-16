import { createApp } from './app';
import { clearAllSchedulers } from './utils/scheduler';
import logger from './utils/logger';
import express from 'express';

const PORT = process.env['PORT'] ?? 3000;

const router = express.Router();
router.get('/status', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

const app = createApp(router);

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

function shutdown(signal: string): void {
  logger.info(`Received ${signal}, shutting down gracefully...`);
  clearAllSchedulers();
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
