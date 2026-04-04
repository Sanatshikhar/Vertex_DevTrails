// Simulated AI/ML Engine — Scikit-learn + Pandas equivalent in TypeScript

export interface PricingInput {
  plan: 'base' | 'pro';
  zone: string;
  reliabilityScore: number;
  claimHistory: number;
  weatherForecast: number; // 0-1 risk score
}

export interface FraudInput {
  gpsVariance: number;
  motionActivity: number;    // 0-1
  appInteraction: number;    // 0-1
  batteryDrain: number;      // 0-1
  networkFluctuation: number; // 0-1
  routeDeviation: number;    // 0-100%
}

export interface PricingResult {
  basePremium: number;
  riskFactor: number;
  discount: number;
  finalPremium: number;
  confidence: number;
  featureImportance: { feature: string; importance: number }[];
}

export interface FraudResult {
  anomalyScore: number;      // -1 to 1 (higher = more anomalous)
  isFraud: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  signals: string[];
  confidence: number;
  decisionPath: string[];
}

// --- Random Forest Regressor (Pricing) ---

export const calculatePremiumML = (input: PricingInput): PricingResult => {
  const basePremium = input.plan === 'pro' ? 55 : 25;
  
  // Simulated feature weights (like sklearn feature_importances_)
  const weights = {
    weatherForecast: 0.35,
    claimHistory: 0.25,
    zoneRisk: 0.20,
    reliabilityScore: 0.20,
  };

  const zoneRiskMap: Record<string, number> = {
    'Koramangala': 0.6, 'HSR Layout': 0.3, 'Indiranagar': 0.8,
    'Whitefield': 0.5, 'JP Nagar': 0.2, 'Electronic City': 0.7,
  };
  const zoneRisk = zoneRiskMap[input.zone] || 0.5;

  // Random Forest ensemble — averaging multiple "trees"
  const trees = [
    1 + (input.weatherForecast * 0.4 + zoneRisk * 0.2 - input.reliabilityScore / 100 * 0.15),
    1 + (input.weatherForecast * 0.3 + input.claimHistory * 0.1 - input.reliabilityScore / 100 * 0.1),
    1 + (zoneRisk * 0.35 + input.weatherForecast * 0.2 - input.reliabilityScore / 100 * 0.2),
    1 + (input.claimHistory * 0.15 + zoneRisk * 0.25 + input.weatherForecast * 0.15),
    1 + (input.weatherForecast * 0.25 + zoneRisk * 0.15 - input.reliabilityScore / 100 * 0.12),
  ];
  const riskFactor = trees.reduce((a, b) => a + b, 0) / trees.length;

  const discount = input.reliabilityScore > 85 ? 0.15 : input.reliabilityScore > 70 ? 0.08 : 0;
  const finalPremium = Math.round(basePremium * riskFactor * (1 - discount));
  const confidence = 0.85 + Math.random() * 0.1;

  return {
    basePremium,
    riskFactor: parseFloat(riskFactor.toFixed(4)),
    discount,
    finalPremium,
    confidence: parseFloat(confidence.toFixed(3)),
    featureImportance: [
      { feature: 'weather_forecast', importance: weights.weatherForecast },
      { feature: 'claim_history', importance: weights.claimHistory },
      { feature: 'zone_risk', importance: weights.zoneRisk },
      { feature: 'reliability_score', importance: weights.reliabilityScore },
    ],
  };
};

// --- Isolation Forest (Fraud Detection) ---

export const detectFraudML = (input: FraudInput): FraudResult => {
  const decisionPath: string[] = [];

  // Isolation Forest: shorter path = more anomalous
  let anomalyScore = 0;

  // GPS check
  if (input.gpsVariance < 0.1) {
    anomalyScore += 0.3;
    decisionPath.push('GPS variance extremely low → suspicious static position');
  } else if (input.gpsVariance < 0.3) {
    anomalyScore += 0.1;
    decisionPath.push('GPS variance low → limited movement detected');
  } else {
    decisionPath.push('GPS variance normal → natural movement patterns');
  }

  // Motion activity
  if (input.motionActivity < 0.2) {
    anomalyScore += 0.25;
    decisionPath.push('Motion activity minimal → no accelerometer data');
  } else {
    decisionPath.push('Motion activity normal → consistent with riding/walking');
  }

  // App interaction
  if (input.appInteraction < 0.15) {
    anomalyScore += 0.2;
    decisionPath.push('App interaction very low → potential background spoofing');
  } else {
    decisionPath.push('App interaction normal → active app usage confirmed');
  }

  // Battery drain (real phones drain battery)
  if (input.batteryDrain < 0.1) {
    anomalyScore += 0.15;
    decisionPath.push('Battery drain abnormally low → emulator suspected');
  } else {
    decisionPath.push('Battery drain consistent → real device confirmed');
  }

  // Route deviation
  if (input.routeDeviation > 60) {
    anomalyScore += 0.2;
    decisionPath.push(`Route deviation ${input.routeDeviation}% → off known delivery paths`);
  } else {
    decisionPath.push('Route follows known delivery paths');
  }

  // Network fluctuation (real mobile networks fluctuate)
  if (input.networkFluctuation < 0.1) {
    anomalyScore += 0.1;
    decisionPath.push('Network too stable → WiFi/emulator suspected');
  } else {
    decisionPath.push('Network fluctuation normal → mobile network confirmed');
  }

  const signals: string[] = [];
  if (input.gpsVariance < 0.1) signals.push('Static GPS');
  if (input.motionActivity < 0.2) signals.push('No motion data');
  if (input.appInteraction < 0.15) signals.push('Low app interaction');
  if (input.batteryDrain < 0.1) signals.push('No battery drain');
  if (input.routeDeviation > 60) signals.push('Route anomaly');
  if (input.networkFluctuation < 0.1) signals.push('Network too stable');

  const isFraud = anomalyScore > 0.5;
  const riskLevel = anomalyScore > 0.7 ? 'high' : anomalyScore > 0.4 ? 'medium' : 'low';
  const confidence = 0.8 + Math.random() * 0.15;

  return {
    anomalyScore: parseFloat(anomalyScore.toFixed(3)),
    isFraud,
    riskLevel,
    signals,
    confidence: parseFloat(confidence.toFixed(3)),
    decisionPath,
  };
};

// --- Swarm Detection (Cluster Analysis) ---

export const detectSwarm = (workerPatterns: { id: string; lat: number; lng: number; timestamp: number }[]) => {
  // Simple distance-based clustering (simulating DBSCAN)
  const clusters: { workers: string[]; centroid: { lat: number; lng: number } }[] = [];
  const eps = 0.005; // ~500m radius

  const visited = new Set<number>();
  for (let i = 0; i < workerPatterns.length; i++) {
    if (visited.has(i)) continue;
    visited.add(i);
    const cluster = [workerPatterns[i].id];
    for (let j = i + 1; j < workerPatterns.length; j++) {
      const dist = Math.sqrt(
        Math.pow(workerPatterns[i].lat - workerPatterns[j].lat, 2) +
        Math.pow(workerPatterns[i].lng - workerPatterns[j].lng, 2)
      );
      if (dist < eps) {
        cluster.push(workerPatterns[j].id);
        visited.add(j);
      }
    }
    if (cluster.length >= 3) {
      clusters.push({ workers: cluster, centroid: { lat: workerPatterns[i].lat, lng: workerPatterns[i].lng } });
    }
  }

  return {
    swarmDetected: clusters.length > 0,
    clusters,
    totalSuspicious: clusters.reduce((sum, c) => sum + c.workers.length, 0),
  };
};
