import logger from './logger';

type Task = () => Promise<void> | void;

const timers: NodeJS.Timeout[] = [];

export function schedule(name: string, intervalMs: number, task: Task): void {
  if (intervalMs < 1000) {
    throw new Error('Interval must be at least 1000 milliseconds');
  }

  logger.info(`Scheduling task "${name}" every ${intervalMs}ms`);

  const timer = setInterval(async () => {
    logger.debug(`Running scheduled task "${name}"`);
    try {
      await task();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      logger.error(`Scheduled task "${name}" failed: ${message}`);
    }
  }, intervalMs);

  timers.push(timer);
}

export function clearAllSchedulers(): void {
  timers.forEach(clearInterval);
  timers.length = 0;
  logger.info('All scheduled tasks stopped');
}
