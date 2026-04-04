// Mock data for the Kavro platform

export interface Worker {
  id: string;
  name: string;
  phone: string;
  platform: string;
  zone: string;
  plan: 'base' | 'pro';
  reliabilityScore: number;
  weeklyEarnings: number;
  totalProtected: number;
  activeSince: string;
  status: 'active' | 'inactive';
}

export interface Policy {
  id: string;
  workerId: string;
  plan: 'base' | 'pro';
  startDate: string;
  endDate: string;
  premium: number;
  maxPayout: number;
  status: 'active' | 'expired' | 'claimed';
  triggers: string[];
  zone: string;
}

export interface Claim {
  id: string;
  workerId: string;
  workerName: string;
  policyId: string;
  triggerType: 'weather' | 'platform' | 'social';
  triggerDetail: string;
  amount: number;
  status: 'approved' | 'pending' | 'flagged' | 'rejected';
  timestamp: string;
  validationScore: number;
  zone: string;
}

export interface TriggerEvent {
  id: string;
  type: 'weather' | 'platform' | 'social';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  zone: string;
  timestamp: string;
  affectedWorkers: number;
  metric: string;
  value: string;
  threshold: string;
}

export interface FraudAlert {
  id: string;
  workerId: string;
  workerName: string;
  riskLevel: 'low' | 'medium' | 'high';
  type: string;
  description: string;
  timestamp: string;
  signals: string[];
}

export const mockWorker: Worker = {
  id: 'W001',
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  platform: 'Zepto',
  zone: 'Koramangala, Bangalore',
  plan: 'pro',
  reliabilityScore: 92,
  weeklyEarnings: 4200,
  totalProtected: 12600,
  activeSince: '2024-01-15',
  status: 'active',
};

export const mockPolicies: Policy[] = [
  {
    id: 'POL-2024-001',
    workerId: 'W001',
    plan: 'pro',
    startDate: '2024-03-25',
    endDate: '2024-03-31',
    premium: 55,
    maxPayout: 800,
    status: 'active',
    triggers: ['Heavy Rain', 'Heatwave', 'App Outage', 'Strike'],
    zone: 'Koramangala, Bangalore',
  },
  {
    id: 'POL-2024-002',
    workerId: 'W001',
    plan: 'pro',
    startDate: '2024-03-18',
    endDate: '2024-03-24',
    premium: 52,
    maxPayout: 800,
    status: 'claimed',
    triggers: ['Heavy Rain', 'Heatwave', 'App Outage', 'Strike'],
    zone: 'Koramangala, Bangalore',
  },
];

export const mockClaims: Claim[] = [
  {
    id: 'CLM-001',
    workerId: 'W001',
    workerName: 'Ravi Kumar',
    policyId: 'POL-2024-002',
    triggerType: 'weather',
    triggerDetail: 'Heavy rainfall: 52mm/hr exceeded 40mm/hr threshold',
    amount: 450,
    status: 'approved',
    timestamp: '2024-03-20T14:30:00',
    validationScore: 0.95,
    zone: 'Koramangala, Bangalore',
  },
  {
    id: 'CLM-002',
    workerId: 'W002',
    workerName: 'Priya Sharma',
    policyId: 'POL-2024-003',
    triggerType: 'platform',
    triggerDetail: 'Zepto app outage: 2.5 hours downtime',
    amount: 350,
    status: 'approved',
    timestamp: '2024-03-19T11:00:00',
    validationScore: 0.88,
    zone: 'HSR Layout, Bangalore',
  },
  {
    id: 'CLM-003',
    workerId: 'W003',
    workerName: 'Amit Patel',
    policyId: 'POL-2024-004',
    triggerType: 'social',
    triggerDetail: 'Local bandh: Zone closure for 4 hours',
    amount: 500,
    status: 'pending',
    timestamp: '2024-03-21T09:00:00',
    validationScore: 0.72,
    zone: 'Indiranagar, Bangalore',
  },
  {
    id: 'CLM-004',
    workerId: 'W004',
    workerName: 'Deepak Singh',
    policyId: 'POL-2024-005',
    triggerType: 'weather',
    triggerDetail: 'Heatwave: 47°C exceeded 45°C threshold',
    amount: 600,
    status: 'flagged',
    timestamp: '2024-03-22T13:00:00',
    validationScore: 0.45,
    zone: 'Whitefield, Bangalore',
  },
];

export const mockTriggerEvents: TriggerEvent[] = [
  {
    id: 'TRG-001',
    type: 'weather',
    severity: 'high',
    description: 'Heavy rainfall detected in Koramangala zone',
    zone: 'Koramangala, Bangalore',
    timestamp: '2024-03-20T14:00:00',
    affectedWorkers: 45,
    metric: 'Rainfall',
    value: '52 mm/hr',
    threshold: '40 mm/hr',
  },
  {
    id: 'TRG-002',
    type: 'platform',
    severity: 'critical',
    description: 'Zepto app experiencing server outage',
    zone: 'All Zones',
    timestamp: '2024-03-19T10:30:00',
    affectedWorkers: 320,
    metric: 'Downtime',
    value: '2.5 hrs',
    threshold: '30 min',
  },
  {
    id: 'TRG-003',
    type: 'weather',
    severity: 'critical',
    description: 'Extreme heatwave warning',
    zone: 'Whitefield, Bangalore',
    timestamp: '2024-03-22T12:00:00',
    affectedWorkers: 28,
    metric: 'Temperature',
    value: '47°C',
    threshold: '45°C',
  },
  {
    id: 'TRG-004',
    type: 'social',
    severity: 'medium',
    description: 'Local bandh called in Indiranagar',
    zone: 'Indiranagar, Bangalore',
    timestamp: '2024-03-21T08:00:00',
    affectedWorkers: 15,
    metric: 'Zone Status',
    value: 'Closed',
    threshold: 'Open',
  },
];

export const mockFraudAlerts: FraudAlert[] = [
  {
    id: 'FRD-001',
    workerId: 'W004',
    workerName: 'Deepak Singh',
    riskLevel: 'high',
    type: 'GPS Spoofing',
    description: 'Static GPS position with no movement for 3 hours during claimed work period',
    timestamp: '2024-03-22T13:30:00',
    signals: ['Static GPS', 'No accelerometer data', 'Low app interaction'],
  },
  {
    id: 'FRD-002',
    workerId: 'W005',
    workerName: 'Suresh Reddy',
    riskLevel: 'medium',
    type: 'Swarm Pattern',
    description: 'Movement pattern matches 4 other workers in same zone exactly',
    timestamp: '2024-03-21T15:00:00',
    signals: ['Identical routes', 'Synchronized timing', 'Same device model'],
  },
];

export const mockAnalytics = {
  totalPolicies: 1247,
  activePolicies: 892,
  totalClaims: 456,
  approvedClaims: 389,
  flaggedClaims: 23,
  totalPayout: 178500,
  lossRatio: 0.68,
  avgPremium: 47,
  weeklyRevenue: 41924,
  fraudDetectionRate: 0.94,
  avgClaimTime: '< 5 min',
  workerSatisfaction: 4.6,
};

export const mockWeeklyData = [
  { week: 'W1', claims: 45, payouts: 22500, premiums: 35000, workers: 780 },
  { week: 'W2', claims: 52, payouts: 28600, premiums: 36200, workers: 810 },
  { week: 'W3', claims: 38, payouts: 18200, premiums: 37500, workers: 845 },
  { week: 'W4', claims: 67, payouts: 38900, premiums: 38100, workers: 870 },
  { week: 'W5', claims: 41, payouts: 21300, premiums: 39800, workers: 892 },
];

export const mockZoneData = [
  { zone: 'Koramangala', workers: 156, claims: 34, risk: 'medium' },
  { zone: 'HSR Layout', workers: 128, claims: 22, risk: 'low' },
  { zone: 'Indiranagar', workers: 98, claims: 45, risk: 'high' },
  { zone: 'Whitefield', workers: 187, claims: 28, risk: 'medium' },
  { zone: 'JP Nagar', workers: 112, claims: 15, risk: 'low' },
  { zone: 'Electronic City', workers: 211, claims: 52, risk: 'high' },
];

export const platforms = ['Zepto', 'Blinkit', 'Swiggy Instamart', 'Zomato', 'Dunzo'];

export const plans = {
  base: {
    name: 'Base',
    price: 25,
    coverage: ['Floods', 'Cyclones', 'Heavy Rain'],
    maxPayout: 500,
  },
  pro: {
    name: 'Pro',
    price: 55,
    coverage: ['Floods', 'Cyclones', 'Heavy Rain', 'Heatwaves', 'Strikes', 'App Crashes'],
    maxPayout: 800,
  },
};
