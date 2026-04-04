// Simulated FastAPI Backend Service
// In production, these would be actual API calls to a FastAPI Python backend

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  handler: (body?: unknown) => Promise<unknown>;
  sampleBody?: unknown;
}

export interface APIResponse<T = unknown> {
  status: number;
  data: T;
  duration_ms: number;
}

// Simulated response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- API Handlers ---

const healthCheck = async () => {
  await delay(200);
  return { status: 'healthy', version: '1.0.0', uptime: '72h 14m', services: { database: 'connected', redis: 'connected', ai_engine: 'running', weather_api: 'active', maps_api: 'active' } };
};

const getWorkers = async () => {
  await delay(300);
  return {
    total: 1247,
    active: 892,
    workers: [
      { id: 'W001', name: 'Ravi Kumar', platform: 'Zepto', zone: 'Koramangala', reliability: 92, status: 'active' },
      { id: 'W002', name: 'Priya Sharma', platform: 'Blinkit', zone: 'HSR Layout', reliability: 88, status: 'active' },
      { id: 'W003', name: 'Amit Patel', platform: 'Swiggy', zone: 'Indiranagar', reliability: 95, status: 'active' },
      { id: 'W004', name: 'Deepak Singh', platform: 'Zepto', zone: 'Whitefield', reliability: 45, status: 'flagged' },
      { id: 'W005', name: 'Suresh Reddy', platform: 'Dunzo', zone: 'JP Nagar', reliability: 78, status: 'active' },
    ],
  };
};

const getTriggers = async () => {
  await delay(250);
  return {
    active_triggers: 3,
    triggers: [
      { id: 'TRG-001', type: 'weather', severity: 'high', zone: 'Koramangala', metric: 'rainfall', value: 52, threshold: 40, unit: 'mm/hr', timestamp: new Date().toISOString() },
      { id: 'TRG-002', type: 'platform', severity: 'critical', zone: 'All', metric: 'downtime', value: 150, threshold: 30, unit: 'min', timestamp: new Date().toISOString() },
      { id: 'TRG-003', type: 'weather', severity: 'critical', zone: 'Whitefield', metric: 'temperature', value: 47, threshold: 45, unit: '°C', timestamp: new Date().toISOString() },
    ],
  };
};

interface ProcessClaimBody {
  worker_id: string;
  trigger_id: string;
}

const processClaim = async (body: unknown) => {
  const payload = body as ProcessClaimBody;
  await delay(500);
  const validationScore = Math.random() * 0.5 + 0.5;
  const approved = validationScore > 0.6;
  return {
    claim_id: `CLM-${Date.now().toString(36).toUpperCase()}`,
    worker_id: payload.worker_id,
    trigger_id: payload.trigger_id,
    validation_score: parseFloat(validationScore.toFixed(3)),
    status: approved ? 'approved' : 'flagged',
    payout_amount: approved ? Math.floor(Math.random() * 400 + 300) : 0,
    processing_time_ms: Math.floor(Math.random() * 2000 + 1000),
    fraud_signals: validationScore < 0.7 ? ['low_movement', 'unusual_pattern'] : [],
    timestamp: new Date().toISOString(),
  };
};

interface CalculatePremiumBody {
  plan: string;
  zone: string;
  reliability_score: number;
}

const calculatePremium = async (body: unknown) => {
  const payload = body as CalculatePremiumBody;
  await delay(400);
  const basePremium = payload.plan === 'pro' ? 55 : 25;
  const riskFactor = 1 + (Math.random() * 0.3 - 0.1);
  const reliabilityDiscount = payload.reliability_score > 80 ? 0.15 : payload.reliability_score > 60 ? 0.08 : 0;
  const noClaimCredit = Math.random() > 0.5 ? 5 : 0;
  const finalPremium = Math.round(basePremium * riskFactor * (1 - reliabilityDiscount) - noClaimCredit);
  return {
    base_premium: basePremium,
    risk_factor: parseFloat(riskFactor.toFixed(3)),
    reliability_discount: `${(reliabilityDiscount * 100).toFixed(0)}%`,
    no_claim_credit: noClaimCredit,
    final_premium: finalPremium,
    model: 'RandomForestRegressor',
    features_used: ['7d_weather_forecast', 'historical_disruptions', 'zone_risk', 'reliability_score'],
  };
};

interface ProcessPaymentBody {
  worker_id: string;
  amount: number;
  upi_id: string;
}

const processPayment = async (body: unknown) => {
  const payload = body as ProcessPaymentBody;
  await delay(600);
  const success = Math.random() > 0.1;
  return {
    transaction_id: `TXN-${Date.now().toString(36).toUpperCase()}`,
    worker_id: payload.worker_id,
    amount: payload.amount,
    upi_id: payload.upi_id,
    status: success ? 'success' : 'failed',
    method: 'UPI',
    provider: 'Mock UPI Gateway',
    timestamp: new Date().toISOString(),
    reference: `KAVRO${Date.now()}`,
  };
};

// --- Endpoint Registry ---

export const endpoints: APIEndpoint[] = [
  { method: 'GET', path: '/api/v1/health', description: 'Health check — all service status', handler: healthCheck },
  { method: 'GET', path: '/api/v1/workers', description: 'List all registered workers', handler: getWorkers },
  { method: 'GET', path: '/api/v1/triggers', description: 'Active parametric triggers', handler: getTriggers },
  { method: 'POST', path: '/api/v1/claims/process', description: 'Process a new claim (AI validation)', handler: processClaim, sampleBody: { worker_id: 'W001', trigger_id: 'TRG-001' } },
  { method: 'POST', path: '/api/v1/pricing/calculate', description: 'Calculate dynamic premium (ML)', handler: calculatePremium, sampleBody: { plan: 'pro', zone: 'Koramangala', reliability_score: 92 } },
  { method: 'POST', path: '/api/v1/payments/upi', description: 'Process mock UPI payout', handler: processPayment, sampleBody: { worker_id: 'W001', amount: 450, upi_id: 'ravi@upi' } },
];

export const callEndpoint = async (endpoint: APIEndpoint, body?: unknown): Promise<APIResponse> => {
  const start = performance.now();
  const result = await endpoint.handler(body);
  const duration = Math.round(performance.now() - start);
  return { status: 200, data: result, duration_ms: duration };
};
