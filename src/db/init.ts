import Database from 'better-sqlite3';

export function initDatabase(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS api_keys (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      key        TEXT    NOT NULL UNIQUE,
      name       TEXT    NOT NULL,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS currencies (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker     TEXT    NOT NULL UNIQUE,
      name       TEXT    NOT NULL UNIQUE,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS wallets (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      address    TEXT    NOT NULL UNIQUE,
      network    TEXT    NOT NULL,
      label      TEXT,
      created_at TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS prices (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      currency_id INTEGER NOT NULL,
      price       TEXT    NOT NULL,
      updated_at  TEXT    NOT NULL,
      FOREIGN KEY (currency_id) REFERENCES currencies(id) ON DELETE CASCADE,
      UNIQUE(currency_id)
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      currency_id INTEGER NOT NULL,
      price       TEXT    NOT NULL,
      recorded_at TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (currency_id) REFERENCES currencies(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scheduler_logs (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      task_name   TEXT    NOT NULL,
      started_at  TEXT    NOT NULL,
      finished_at TEXT,
      status      TEXT    NOT NULL,
      error       TEXT
    );
  `);
}
