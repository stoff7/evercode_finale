const LEVELS: Record<string, number> = {
  trace: 0,
  debug: 1,
  info: 2,
  warn: 3,
  error: 4,
};

class Logger {
  private minLevel: number;

  constructor(minLevel = 'info') {
    this.minLevel = LEVELS[minLevel] ?? LEVELS['info'];
  }

  private log(message: string, level: string): void {
    if ((LEVELS[level] ?? 0) < this.minLevel) return;

    const timestamp = new Date().toISOString();
    const output = `[${timestamp}] crypto-tracker [${level.toUpperCase()}] ${message}`;

    if (level === 'error') console.error(output);
    else if (level === 'warn') console.warn(output);
    else console.log(output);
  }

  trace(message: string): void { this.log(message, 'trace'); }
  debug(message: string): void { this.log(message, 'debug'); }
  info(message: string): void { this.log(message, 'info'); }
  warn(message: string): void { this.log(message, 'warn'); }
  error(message: string): void { this.log(message, 'error'); }
}

export default new Logger(process.env['LOG_LEVEL'] ?? 'info');
