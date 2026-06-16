export interface Currency {
  id: number;
  ticker: string;
  name: string;
  created_at: string;
}

export interface Wallet {
  id: number;
  address: string;
  network: string;
  label: string | null;
  created_at: string;
}

export interface Price {
  id: number;
  currency_id: number;
  price: string;
  updated_at: string;
}

export interface PriceHistory {
  id: number;
  currency_id: number;
  price: string;
  recorded_at: string;
}

export interface ApiKey {
  id: number;
  key: string;
  name: string;
  created_at: string;
}

export interface SchedulerLog {
  id: number;
  task_name: string;
  started_at: string;
  finished_at: string | null;
  status: string;
  error: string | null;
}
