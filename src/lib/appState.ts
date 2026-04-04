export type PlanKey = "base" | "pro";

export interface AdminSession {
  email: string;
  displayName: string;
  role: "admin";
  authenticatedAt: string;
}

export interface WorkerSession {
  workerId: string;
  workerName: string;
  phone: string;
  platform: string;
  zone: string;
  plan: PlanKey;
  premium: number;
  maxPayout: number;
  coverage: string[];
  policyId: string;
  policyStart: string;
  policyEnd: string;
  reliabilityScore: number;
  upiId: string;
  paymentReference: string;
  paymentStatus: "success" | "failed";
  activatedAt: string;
}

const workerSessionKey = "kavro.worker.session";
const adminSessionKey = "kavro.admin.session";

export const adminAllowlist = [
  "prateekpatipati@gmail.com",
  "shloktoya2007@gmail.com",
  "prayashchandrapradhan@gmail.com",
  "mistycaljyoti@gmail.com",
  "cavijit1806@gmail.com",
  "priyadarshinipradhan945@gmail.com",
  "gargimohapatra123@gmail.com",
  "bosesainandan06@gmail.com",
  "rohitmahantakjh@gmail.com",
  "lksahu120206@gmail.com",
  "jibiteshkumarmishra8027@gmail.com",
  "mausuminanda977@gmail.com",
  "ayushkumarpandey238@gmail.com",
  "sidharthsahoo2005@gmail.com",
  "hritamrc@gmail.com",
  "adarshgouravjp@gmail.com",
];

const getStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

const readJson = <T,>(key: string): T | null => {
  try {
    const storage = getStorage();
    const value = storage?.getItem(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    const storage = getStorage();
    storage?.setItem(key, JSON.stringify(value));
  } catch {
    return false;
  }

  return true;
};

export const loadWorkerSession = () => readJson<WorkerSession>(workerSessionKey);

export const saveWorkerSession = (session: WorkerSession) => writeJson(workerSessionKey, session);

export const clearWorkerSession = () => {
  try {
    const storage = getStorage();
    storage?.removeItem(workerSessionKey);
  } catch {
    return false;
  }

  return true;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const isAllowedAdminEmail = (email: string) =>
  adminAllowlist.includes(normalizeEmail(email));

export const loadAdminSession = () => readJson<AdminSession>(adminSessionKey);

export const saveAdminSession = (email: string) =>
  writeJson(adminSessionKey, {
    email: normalizeEmail(email),
    displayName: normalizeEmail(email).split("@")[0],
    role: "admin",
    authenticatedAt: new Date().toISOString(),
  } satisfies AdminSession);

export const clearAdminSession = () => {
  try {
    const storage = getStorage();
    storage?.removeItem(adminSessionKey);
  } catch {
    return false;
  }

  return true;
};