// Simulated PostgreSQL + Redis Database Layer

export interface DBTable {
  name: string;
  columns: { name: string; type: string; constraint?: string }[];
  rows: Record<string, unknown>[];
  rowCount: number;
}

export interface RedisEntry {
  key: string;
  value: unknown;
  ttl: number; // seconds
  type: 'string' | 'hash' | 'list' | 'set';
}

// --- PostgreSQL Tables ---

export const pgTables: DBTable[] = [
  {
    name: 'workers',
    columns: [
      { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY' },
      { name: 'name', type: 'VARCHAR(100)', constraint: 'NOT NULL' },
      { name: 'phone', type: 'VARCHAR(15)', constraint: 'UNIQUE NOT NULL' },
      { name: 'platform', type: 'VARCHAR(50)', constraint: 'NOT NULL' },
      { name: 'zone_id', type: 'UUID', constraint: 'REFERENCES zones(id)' },
      { name: 'reliability_score', type: 'DECIMAL(5,2)', constraint: 'DEFAULT 50.0' },
      { name: 'status', type: 'ENUM', constraint: "('active','inactive','flagged')" },
      { name: 'created_at', type: 'TIMESTAMPTZ', constraint: 'DEFAULT NOW()' },
    ],
    rows: [
      { id: 'W001', name: 'Ravi Kumar', phone: '+919876543210', platform: 'Zepto', zone_id: 'Z001', reliability_score: 92.0, status: 'active', created_at: '2024-01-15' },
      { id: 'W002', name: 'Priya Sharma', phone: '+919876543211', platform: 'Blinkit', zone_id: 'Z002', reliability_score: 88.5, status: 'active', created_at: '2024-02-01' },
      { id: 'W003', name: 'Amit Patel', phone: '+919876543212', platform: 'Swiggy', zone_id: 'Z003', reliability_score: 95.2, status: 'active', created_at: '2024-01-20' },
      { id: 'W004', name: 'Deepak Singh', phone: '+919876543213', platform: 'Zepto', zone_id: 'Z004', reliability_score: 45.1, status: 'flagged', created_at: '2024-03-01' },
    ],
    rowCount: 1247,
  },
  {
    name: 'policies',
    columns: [
      { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY' },
      { name: 'worker_id', type: 'UUID', constraint: 'REFERENCES workers(id)' },
      { name: 'plan', type: 'ENUM', constraint: "('base','pro')" },
      { name: 'premium', type: 'DECIMAL(10,2)', constraint: 'NOT NULL' },
      { name: 'max_payout', type: 'DECIMAL(10,2)', constraint: 'NOT NULL' },
      { name: 'start_date', type: 'DATE', constraint: 'NOT NULL' },
      { name: 'end_date', type: 'DATE', constraint: 'NOT NULL' },
      { name: 'status', type: 'ENUM', constraint: "('active','expired','claimed')" },
    ],
    rows: [
      { id: 'POL-001', worker_id: 'W001', plan: 'pro', premium: 52.00, max_payout: 800.00, start_date: '2024-03-25', end_date: '2024-03-31', status: 'active' },
      { id: 'POL-002', worker_id: 'W002', plan: 'base', premium: 23.00, max_payout: 500.00, start_date: '2024-03-25', end_date: '2024-03-31', status: 'active' },
      { id: 'POL-003', worker_id: 'W003', plan: 'pro', premium: 48.00, max_payout: 800.00, start_date: '2024-03-18', end_date: '2024-03-24', status: 'claimed' },
    ],
    rowCount: 892,
  },
  {
    name: 'claims',
    columns: [
      { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY' },
      { name: 'policy_id', type: 'UUID', constraint: 'REFERENCES policies(id)' },
      { name: 'trigger_type', type: 'ENUM', constraint: "('weather','platform','social')" },
      { name: 'trigger_detail', type: 'TEXT' },
      { name: 'amount', type: 'DECIMAL(10,2)' },
      { name: 'validation_score', type: 'DECIMAL(3,2)' },
      { name: 'status', type: 'ENUM', constraint: "('approved','pending','flagged','rejected')" },
      { name: 'processed_at', type: 'TIMESTAMPTZ' },
    ],
    rows: [
      { id: 'CLM-001', policy_id: 'POL-003', trigger_type: 'weather', trigger_detail: 'Rainfall 52mm/hr', amount: 450.00, validation_score: 0.95, status: 'approved', processed_at: '2024-03-20 14:32:00' },
      { id: 'CLM-002', policy_id: 'POL-002', trigger_type: 'platform', trigger_detail: 'Zepto outage 2.5hrs', amount: 350.00, validation_score: 0.88, status: 'approved', processed_at: '2024-03-19 11:05:00' },
    ],
    rowCount: 456,
  },
  {
    name: 'trigger_events',
    columns: [
      { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY' },
      { name: 'type', type: 'ENUM', constraint: "('weather','platform','social')" },
      { name: 'severity', type: 'ENUM', constraint: "('low','medium','high','critical')" },
      { name: 'zone_id', type: 'UUID', constraint: 'REFERENCES zones(id)' },
      { name: 'metric', type: 'VARCHAR(50)' },
      { name: 'value', type: 'DECIMAL(10,2)' },
      { name: 'threshold', type: 'DECIMAL(10,2)' },
      { name: 'affected_workers', type: 'INTEGER' },
      { name: 'detected_at', type: 'TIMESTAMPTZ', constraint: 'DEFAULT NOW()' },
    ],
    rows: [
      { id: 'TRG-001', type: 'weather', severity: 'high', zone_id: 'Z001', metric: 'rainfall', value: 52.0, threshold: 40.0, affected_workers: 45, detected_at: '2024-03-20 14:00:00' },
      { id: 'TRG-002', type: 'platform', severity: 'critical', zone_id: 'ALL', metric: 'downtime_min', value: 150, threshold: 30, affected_workers: 320, detected_at: '2024-03-19 10:30:00' },
    ],
    rowCount: 234,
  },
  {
    name: 'zones',
    columns: [
      { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY' },
      { name: 'name', type: 'VARCHAR(100)', constraint: 'NOT NULL' },
      { name: 'city', type: 'VARCHAR(50)' },
      { name: 'lat', type: 'DECIMAL(10,7)' },
      { name: 'lng', type: 'DECIMAL(10,7)' },
      { name: 'radius_km', type: 'DECIMAL(5,2)', constraint: 'DEFAULT 2.5' },
      { name: 'risk_level', type: 'ENUM', constraint: "('low','medium','high')" },
    ],
    rows: [
      { id: 'Z001', name: 'Koramangala', city: 'Bangalore', lat: 12.9352, lng: 77.6245, radius_km: 2.5, risk_level: 'medium' },
      { id: 'Z002', name: 'HSR Layout', city: 'Bangalore', lat: 12.9116, lng: 77.6389, radius_km: 2.0, risk_level: 'low' },
      { id: 'Z003', name: 'Indiranagar', city: 'Bangalore', lat: 12.9784, lng: 77.6408, radius_km: 2.0, risk_level: 'high' },
      { id: 'Z004', name: 'Whitefield', city: 'Bangalore', lat: 12.9698, lng: 77.7500, radius_km: 3.0, risk_level: 'medium' },
    ],
    rowCount: 24,
  },
  {
    name: 'payments',
    columns: [
      { name: 'id', type: 'UUID', constraint: 'PRIMARY KEY' },
      { name: 'claim_id', type: 'UUID', constraint: 'REFERENCES claims(id)' },
      { name: 'worker_id', type: 'UUID', constraint: 'REFERENCES workers(id)' },
      { name: 'amount', type: 'DECIMAL(10,2)' },
      { name: 'upi_id', type: 'VARCHAR(100)' },
      { name: 'status', type: 'ENUM', constraint: "('success','failed','pending')" },
      { name: 'txn_ref', type: 'VARCHAR(100)', constraint: 'UNIQUE' },
      { name: 'processed_at', type: 'TIMESTAMPTZ' },
    ],
    rows: [
      { id: 'PAY-001', claim_id: 'CLM-001', worker_id: 'W001', amount: 450.00, upi_id: 'ravi@upi', status: 'success', txn_ref: 'KAVRO1710938520', processed_at: '2024-03-20 14:35:00' },
      { id: 'PAY-002', claim_id: 'CLM-002', worker_id: 'W002', amount: 350.00, upi_id: 'priya@upi', status: 'success', txn_ref: 'KAVRO1710841500', processed_at: '2024-03-19 11:10:00' },
    ],
    rowCount: 389,
  },
];

// --- Redis Cache ---

export const redisCache: RedisEntry[] = [
  { key: 'trigger:active:Z001', value: { type: 'weather', severity: 'high', rainfall: 52 }, ttl: 300, type: 'hash' },
  { key: 'trigger:active:Z004', value: { type: 'weather', severity: 'critical', temperature: 47 }, ttl: 300, type: 'hash' },
  { key: 'worker:session:W001', value: { lat: 12.935, lng: 77.624, lastPing: Date.now() }, ttl: 60, type: 'hash' },
  { key: 'worker:session:W002', value: { lat: 12.911, lng: 77.639, lastPing: Date.now() }, ttl: 60, type: 'hash' },
  { key: 'pricing:cache:pro:Z001', value: 52, ttl: 3600, type: 'string' },
  { key: 'pricing:cache:base:Z002', value: 23, ttl: 3600, type: 'string' },
  { key: 'weather:forecast:Z001', value: [0.8, 0.6, 0.3, 0.2, 0.1, 0.4, 0.7], ttl: 1800, type: 'list' },
  { key: 'rate_limit:api:192.168.1.1', value: 47, ttl: 60, type: 'string' },
  { key: 'fraud:watchlist', value: ['W004', 'W005'], ttl: -1, type: 'set' },
  { key: 'platform:status:zepto', value: { status: 'degraded', lastCheck: Date.now() }, ttl: 30, type: 'hash' },
];

// --- SQL Query Simulator ---

export const executeQuery = (sql: string): { columns: string[]; rows: Record<string, unknown>[]; rowCount: number; executionTime: number } => {
  const start = performance.now();
  const upperSQL = sql.toUpperCase().trim();

  // Basic SELECT parser
  if (upperSQL.startsWith('SELECT')) {
    const fromMatch = sql.match(/FROM\s+(\w+)/i);
    if (fromMatch) {
      const tableName = fromMatch[1];
      const table = pgTables.find(t => t.name === tableName);
      if (table) {
        const whereMatch = sql.match(/WHERE\s+(\w+)\s*=\s*'?([^'\s;]+)'?/i);
        let filteredRows = table.rows;
        if (whereMatch) {
          const [, col, val] = whereMatch;
          filteredRows = table.rows.filter(r => String(r[col]) === val);
        }
        const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
        if (limitMatch) filteredRows = filteredRows.slice(0, parseInt(limitMatch[1]));
        return {
          columns: table.columns.map(c => c.name),
          rows: filteredRows,
          rowCount: filteredRows.length,
          executionTime: Math.round(performance.now() - start) + Math.floor(Math.random() * 5),
        };
      }
    }
  }

  return { columns: ['error'], rows: [{ error: 'Query not recognized' }], rowCount: 0, executionTime: Math.round(performance.now() - start) };
};
