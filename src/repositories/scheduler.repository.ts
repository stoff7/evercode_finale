import Database from 'better-sqlite3';
import { SchedulerLog } from '../types';

export class SchedulerRepository {
  constructor(private db: Database.Database) {}

  createLog(taskName: string): SchedulerLog {
    const result = this.db.prepare(
      `INSERT INTO scheduler_logs (task_name, started_at, status) VALUES (?, ?, 'running')`
    ).run(taskName, new Date().toISOString());

    return this.db.prepare<[number | bigint], SchedulerLog>(
      'SELECT * FROM scheduler_logs WHERE id = ?'
    ).get(result.lastInsertRowid) as SchedulerLog;
  }

  updateLog(id: number, status: 'success' | 'error', error?: string): void {
    this.db.prepare(
      'UPDATE scheduler_logs SET status = ?, finished_at = ?, error = ? WHERE id = ?'
    ).run(status, new Date().toISOString(), error ?? null, id);
  }

  findAll(): SchedulerLog[] {
    return this.db.prepare<[], SchedulerLog>(
      'SELECT * FROM scheduler_logs ORDER BY started_at DESC'
    ).all();
  }
}
