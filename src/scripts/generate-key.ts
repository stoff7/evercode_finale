import crypto from 'crypto';
import path from 'path';
import { createDatabase } from '../db/database';
import { ApiKeyRepository } from '../repositories/apiKey.repository';

const name = process.argv[2];

if (!name) {
  console.error('Usage: npm run generate-key <name>');
  process.exit(1);
}

const dbPath = path.resolve(process.cwd(), 'data', 'crypto-tracker.db');
const db = createDatabase(dbPath);
const repo = new ApiKeyRepository(db);

const key = crypto.randomBytes(32).toString('hex');
const apiKey = repo.create(key, name);

console.log(`\nAPI key created for "${apiKey.name}":`);
console.log(`\nBearer ${apiKey.key}\n`);

db.close();
