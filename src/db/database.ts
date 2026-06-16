import Database from 'better-sqlite3';
import path from 'path';
import { initDatabase } from './init';
import logger from '../utils/logger';

export function createDatabase(dbPath?: string): Database.Database {
  const resolvedPath = dbPath ?? path.resolve(process.cwd(), 'data', 'crypto-tracker.db');
  const db = new Database(resolvedPath);

  db.pragma('foreign_keys = ON');
  db.pragma('journal_mode = WAL');

  initDatabase(db);

  logger.info(`Database connected: ${resolvedPath}`);
  return db;
}
