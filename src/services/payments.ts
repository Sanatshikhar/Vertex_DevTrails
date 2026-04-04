// Simulated UPI Payment Gateway

export interface UPIPayment {
  transactionId: string;
  workerId: string;
  workerName: string;
  amount: number;
  upiId: string;
  status: 'initiated' | 'processing' | 'success' | 'failed';
  method: 'UPI';
  provider: string;
  timestamp: string;
  reference: string;
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

export const initiateUPIPayment = async (
  workerId: string,
  workerName: string,
  amount: number,
  upiId: string
): Promise<UPIPayment> => {
  const txnId = `TXN-${Date.now().toString(36).toUpperCase()}`;

  // Phase 1: Initiate
  await delay(200);

  // Phase 2: Process
  await delay(800);

  // Phase 3: Result
  const success = Math.random() > 0.08; // 92% success rate

  return {
    transactionId: txnId,
    workerId,
    workerName,
    amount,
    upiId,
    status: success ? 'success' : 'failed',
    method: 'UPI',
    provider: 'Mock UPI Gateway v2.0',
    timestamp: new Date().toISOString(),
    reference: `KAVRO${Date.now()}`,
  };
};

export const mockPaymentHistory: UPIPayment[] = [
  { transactionId: 'TXN-MK8X01', workerId: 'W001', workerName: 'Ravi Kumar', amount: 450, upiId: 'ravi@upi', status: 'success', method: 'UPI', provider: 'Mock UPI Gateway', timestamp: '2024-03-20T14:35:00Z', reference: 'KAVRO1710938520' },
  { transactionId: 'TXN-MK8X02', workerId: 'W002', workerName: 'Priya Sharma', amount: 350, upiId: 'priya@ybl', status: 'success', method: 'UPI', provider: 'Mock UPI Gateway', timestamp: '2024-03-19T11:10:00Z', reference: 'KAVRO1710841500' },
  { transactionId: 'TXN-MK8X03', workerId: 'W003', workerName: 'Amit Patel', amount: 500, upiId: 'amit@paytm', status: 'success', method: 'UPI', provider: 'Mock UPI Gateway', timestamp: '2024-03-21T09:22:00Z', reference: 'KAVRO1711005720' },
  { transactionId: 'TXN-MK8X04', workerId: 'W005', workerName: 'Suresh Reddy', amount: 280, upiId: 'suresh@gpay', status: 'failed', method: 'UPI', provider: 'Mock UPI Gateway', timestamp: '2024-03-22T16:45:00Z', reference: 'KAVRO1711118700' },
];
