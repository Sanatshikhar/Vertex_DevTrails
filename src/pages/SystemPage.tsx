import { useState, useEffect } from "react";
import {
  Server, Database, Brain, Cloud, MapPin, IndianRupee, Play, ChevronDown, ChevronRight,
  CheckCircle, XCircle, Clock, AlertTriangle, Zap, Terminal, Table, HardDrive, Cpu,
  Shield, ArrowLeft, Loader2, Send, CloudRain, Thermometer, Wind, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { endpoints, callEndpoint } from "@/services/fastapi";
import { calculatePremiumML, detectFraudML } from "@/services/aiEngine";
import { pgTables, redisCache, executeQuery } from "@/services/database";
import { getAllZoneWeather, getPlatformStatus, type WeatherData, type PlatformStatus } from "@/services/externalAPIs";
import { initiateUPIPayment, mockPaymentHistory, type UPIPayment } from "@/services/payments";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import type { PricingResult, FraudResult } from "@/services/aiEngine";

type Section = 'fastapi' | 'aiml' | 'database' | 'apis' | 'payments';

type ApiConsoleResponse = {
  status: number;
  data: unknown;
  duration_ms: number;
};

type QueryConsoleResult = {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
};

const getErrorMessage = (error: unknown) => (error instanceof Error ? error.message : "Unknown error");

const SystemPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('fastapi');

  const sections: { id: Section; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'fastapi', label: 'FastAPI Backend', icon: Server, color: 'text-success bg-success/10' },
    { id: 'aiml', label: 'AI/ML Engine', icon: Brain, color: 'text-primary bg-primary/10' },
    { id: 'database', label: 'PostgreSQL + Redis', icon: Database, color: 'text-info bg-info/10' },
    { id: 'apis', label: 'Weather & Maps', icon: Cloud, color: 'text-warning bg-warning/10' },
    { id: 'payments', label: 'Mock UPI', icon: IndianRupee, color: 'text-accent bg-accent/10' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate('/')} className="p-2 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 transition-colors">
            <ArrowLeft className="h-4 w-4 text-primary-foreground" />
          </button>
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-bold text-primary-foreground">Kavro System Control Center</h1>
        </div>
        <div className="flex overflow-x-auto gap-2 pb-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === s.id
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'bg-sidebar-accent text-primary-foreground/70 hover:text-primary-foreground'
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 lg:p-8 max-w-7xl mx-auto">
        {activeSection === 'fastapi' && <FastAPISection />}
        {activeSection === 'aiml' && <AIMLSection />}
        {activeSection === 'database' && <DatabaseSection />}
        {activeSection === 'apis' && <APIsSection />}
        {activeSection === 'payments' && <PaymentsSection />}
      </div>
    </div>
  );
};

// ============ FASTAPI SECTION ============
const FastAPISection = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [response, setResponse] = useState<ApiConsoleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState('');

  const ep = endpoints[selectedEndpoint];
  const sampleBody = ep.sampleBody;

  useEffect(() => {
    setBody(sampleBody ? JSON.stringify(sampleBody, null, 2) : '');
    setResponse(null);
  }, [selectedEndpoint, sampleBody]);

  const runRequest = async () => {
    setLoading(true);
    try {
      const parsedBody = body ? JSON.parse(body) : undefined;
      const result = await callEndpoint(ep, parsedBody);
      setResponse(result);
    } catch (error: unknown) {
      setResponse({ status: 400, data: { error: getErrorMessage(error) }, duration_ms: 0 });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Server className="h-6 w-6 text-success" /> FastAPI Backend
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Interactive API explorer — Python FastAPI simulation</p>
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-2">
        {['Python 3.11', 'FastAPI 0.104', 'Uvicorn', 'Pydantic v2', 'JWT Auth'].map((t) => (
          <span key={t} className="text-xs px-3 py-1 rounded-full bg-success/10 text-success font-medium">{t}</span>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Endpoints */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Terminal className="h-4 w-4" /> Endpoints
          </h3>
          {endpoints.map((ep, i) => (
            <button
              key={ep.path}
              onClick={() => setSelectedEndpoint(i)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedEndpoint === i ? 'border-success bg-success/5' : 'border-border bg-card hover:border-success/30'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  ep.method === 'GET' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                }`}>{ep.method}</span>
                <code className="text-sm text-foreground">{ep.path}</code>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{ep.description}</p>
            </button>
          ))}
        </div>

        {/* Request/Response */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Request</h3>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  ep.method === 'GET' ? 'bg-info/10 text-info' : 'bg-warning/10 text-warning'
                }`}>{ep.method}</span>
                <code className="text-xs text-muted-foreground">{ep.path}</code>
              </div>
            </div>
            {ep.sampleBody && (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-28 p-3 rounded-lg bg-foreground/5 text-sm font-mono text-foreground border border-border resize-none focus:outline-none focus:ring-2 focus:ring-success/50"
              />
            )}
            <Button
              variant="success"
              className="w-full mt-3"
              onClick={runRequest}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {loading ? 'Executing...' : 'Send Request'}
            </Button>
          </div>

          {response && (
            <div className="p-4 rounded-xl bg-card border border-border animate-slide-in-right">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Response</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    response.status === 200 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>{response.status}</span>
                  <span className="text-xs text-muted-foreground">{response.duration_ms}ms</span>
                </div>
              </div>
              <pre className="text-xs font-mono bg-foreground/5 p-3 rounded-lg overflow-auto max-h-64 text-foreground">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ AI/ML SECTION ============
const AIMLSection = () => {
  const [pricingResult, setPricingResult] = useState<PricingResult | null>(null);
  const [fraudResult, setFraudResult] = useState<FraudResult | null>(null);
  const [pricingInputs, setPricingInputs] = useState({ plan: 'pro' as 'base' | 'pro', zone: 'Koramangala', reliabilityScore: 92, claimHistory: 2, weatherForecast: 0.7 });
  const [fraudInputs, setFraudInputs] = useState({ gpsVariance: 0.05, motionActivity: 0.1, appInteraction: 0.08, batteryDrain: 0.05, networkFluctuation: 0.04, routeDeviation: 75 });

  const runPricing = () => setPricingResult(calculatePremiumML(pricingInputs));
  const runFraud = () => setFraudResult(detectFraudML(fraudInputs));

  const featureData = pricingResult?.featureImportance?.map((f) => ({
    feature: f.feature.replace('_', ' '),
    importance: Math.round(f.importance * 100),
  }));

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" /> AI/ML Engine
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Scikit-learn + Pandas — pricing & fraud detection models</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {['Scikit-learn 1.3', 'Pandas 2.1', 'NumPy', 'RandomForest', 'IsolationForest', 'DBSCAN'].map((t) => (
          <span key={t} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{t}</span>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pricing Engine */}
        <div className="p-5 rounded-xl bg-card border border-border space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" /> Random Forest Pricing
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground">Plan</label>
              <select value={pricingInputs.plan} onChange={(e) => setPricingInputs(p => ({ ...p, plan: e.target.value as 'base' | 'pro' }))} className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm">
                <option value="base">Base (₹25)</option>
                <option value="pro">Pro (₹55)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Zone</label>
              <select value={pricingInputs.zone} onChange={(e) => setPricingInputs(p => ({ ...p, zone: e.target.value }))} className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm">
                {['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'JP Nagar', 'Electronic City'].map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Reliability Score</label>
              <Input type="number" min={0} max={100} value={pricingInputs.reliabilityScore} onChange={(e) => setPricingInputs(p => ({ ...p, reliabilityScore: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Weather Risk (0-1)</label>
              <Input type="number" min={0} max={1} step={0.1} value={pricingInputs.weatherForecast} onChange={(e) => setPricingInputs(p => ({ ...p, weatherForecast: Number(e.target.value) }))} />
            </div>
          </div>
          <Button variant="hero" className="w-full" onClick={runPricing}>
            <Brain className="h-4 w-4" /> Run Pricing Model
          </Button>
          {pricingResult && (
            <div className="space-y-3 animate-slide-in-right">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-muted">
                  <div className="text-xs text-muted-foreground">Final Premium</div>
                  <div className="text-2xl font-bold text-foreground">₹{pricingResult.finalPremium}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="text-xs text-muted-foreground">Risk Factor</div>
                  <div className="text-2xl font-bold text-foreground">{pricingResult.riskFactor}x</div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="text-xs text-muted-foreground">Discount</div>
                  <div className="text-lg font-bold text-success">{(pricingResult.discount * 100).toFixed(0)}%</div>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <div className="text-xs text-muted-foreground">Confidence</div>
                  <div className="text-lg font-bold text-foreground">{(pricingResult.confidence * 100).toFixed(1)}%</div>
                </div>
              </div>
              {featureData && (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={featureData} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(220 10% 46%)" />
                    <YAxis type="category" dataKey="feature" tick={{ fontSize: 10 }} width={100} stroke="hsl(220 10% 46%)" />
                    <Tooltip />
                    <Bar dataKey="importance" fill="hsl(24 95% 53%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>

        {/* Fraud Detection */}
        <div className="p-5 rounded-xl bg-card border border-border space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Isolation Forest Fraud Detection
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {([
              { key: 'gpsVariance', label: 'GPS Variance', min: 0, max: 1, step: 0.05 },
              { key: 'motionActivity', label: 'Motion Activity', min: 0, max: 1, step: 0.1 },
              { key: 'appInteraction', label: 'App Interaction', min: 0, max: 1, step: 0.05 },
              { key: 'batteryDrain', label: 'Battery Drain', min: 0, max: 1, step: 0.05 },
              { key: 'networkFluctuation', label: 'Network Fluctuation', min: 0, max: 1, step: 0.05 },
              { key: 'routeDeviation', label: 'Route Deviation %', min: 0, max: 100, step: 5 },
            ] as const).map((input) => (
              <div key={input.key}>
                <label className="text-xs text-muted-foreground">{input.label}</label>
                <Input
                  type="number"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={fraudInputs[input.key]}
                  onChange={(e) => setFraudInputs(p => ({ ...p, [input.key]: Number(e.target.value) }))}
                />
              </div>
            ))}
          </div>
          <Button variant="destructive" className="w-full" onClick={runFraud}>
            <Eye className="h-4 w-4" /> Run Fraud Detection
          </Button>
          {fraudResult && (
            <div className="space-y-3 animate-slide-in-right">
              <div className={`p-4 rounded-lg ${fraudResult.isFraud ? 'bg-destructive/10 border border-destructive/30' : 'bg-success/10 border border-success/30'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {fraudResult.isFraud ? <XCircle className="h-5 w-5 text-destructive" /> : <CheckCircle className="h-5 w-5 text-success" />}
                  <span className="font-bold text-foreground">{fraudResult.isFraud ? 'FRAUD DETECTED' : 'LEGITIMATE'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-auto capitalize ${
                    fraudResult.riskLevel === 'high' ? 'bg-destructive/20 text-destructive' :
                    fraudResult.riskLevel === 'medium' ? 'bg-warning/20 text-warning' :
                    'bg-success/20 text-success'
                  }`}>{fraudResult.riskLevel} risk</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Anomaly Score: <strong className="text-foreground">{fraudResult.anomalyScore}</strong> | Confidence: <strong className="text-foreground">{(fraudResult.confidence * 100).toFixed(1)}%</strong>
                </div>
              </div>
              {fraudResult.signals.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {fraudResult.signals.map((s: string) => (
                    <span key={s} className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">{s}</span>
                  ))}
                </div>
              )}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-muted-foreground">Decision Path</h4>
                {fraudResult.decisionPath.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-muted-foreground mt-0.5">{i + 1}.</span>
                    <span className="text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============ DATABASE SECTION ============
const DatabaseSection = () => {
  const [selectedTable, setSelectedTable] = useState(0);
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM workers WHERE status = 'active'");
  const [queryResult, setQueryResult] = useState<QueryConsoleResult | null>(null);

  const table = pgTables[selectedTable];

  const runQuery = () => setQueryResult(executeQuery(sqlQuery));

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Database className="h-6 w-6 text-info" /> PostgreSQL + Redis
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Database schema, sample data, cache layer & SQL console</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {['PostgreSQL 15', 'Redis 7.2', 'pgBouncer', 'TimescaleDB', 'pg_cron'].map((t) => (
          <span key={t} className="text-xs px-3 py-1 rounded-full bg-info/10 text-info font-medium">{t}</span>
        ))}
      </div>

      {/* Tables */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Table className="h-4 w-4" /> PostgreSQL Tables ({pgTables.length})
        </h3>
        <div className="flex overflow-x-auto gap-2 mb-4">
          {pgTables.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setSelectedTable(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
                selectedTable === i ? 'bg-info/10 text-info border border-info/30' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.name} <span className="text-muted-foreground">({t.rowCount})</span>
            </button>
          ))}
        </div>

        {/* Schema */}
        <div className="p-4 rounded-xl bg-card border border-border mb-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Schema: {table.name}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="p-2">Column</th><th className="p-2">Type</th><th className="p-2">Constraint</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col) => (
                  <tr key={col.name} className="border-t border-border">
                    <td className="p-2 font-mono text-foreground">{col.name}</td>
                    <td className="p-2 text-info">{col.type}</td>
                    <td className="p-2 text-muted-foreground">{col.constraint || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sample Data */}
        <div className="p-4 rounded-xl bg-card border border-border mb-4">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">Sample Rows ({table.rows.length} shown / {table.rowCount} total)</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-muted-foreground">
                  {table.columns.map(c => <th key={c.name} className="p-2 whitespace-nowrap">{c.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i} className="border-t border-border">
                    {table.columns.map(c => (
                      <td key={c.name} className="p-2 font-mono text-foreground whitespace-nowrap">{String(row[c.name] ?? '-')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SQL Console */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Terminal className="h-4 w-4" /> SQL Console
        </h3>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          className="w-full h-20 p-3 rounded-lg bg-foreground/5 text-sm font-mono text-foreground border border-border resize-none focus:outline-none focus:ring-2 focus:ring-info/50"
          placeholder="SELECT * FROM workers WHERE status = 'active'"
        />
        <div className="flex gap-2 mt-2">
          <Button onClick={runQuery} className="bg-info text-info-foreground hover:bg-info/90">
            <Play className="h-4 w-4" /> Execute
          </Button>
          <div className="flex gap-1">
            {[
              "SELECT * FROM workers",
              "SELECT * FROM claims WHERE status = 'approved'",
              "SELECT * FROM zones",
              "SELECT * FROM payments",
            ].map((q) => (
              <button key={q} onClick={() => { setSqlQuery(q); }} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:text-foreground transition-colors">
                {q.substring(0, 25)}...
              </button>
            ))}
          </div>
        </div>
        {queryResult && (
          <div className="mt-3 animate-slide-in-right">
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              {queryResult.rowCount} rows · {queryResult.executionTime}ms
            </div>
            <div className="overflow-x-auto max-h-48">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    {queryResult.columns.map((c: string) => <th key={c} className="p-2">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.rows.map((row, i: number) => (
                    <tr key={i} className="border-t border-border">
                      {queryResult.columns.map((c: string) => (
                        <td key={c} className="p-2 font-mono text-foreground whitespace-nowrap">{String(row[c] ?? '-')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Redis */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-destructive" /> Redis Cache ({redisCache.length} keys)
        </h3>
        <div className="space-y-2">
          {redisCache.map((entry) => (
            <div key={entry.key} className="p-3 rounded-lg bg-muted flex items-start justify-between gap-4">
              <div className="min-w-0">
                <code className="text-xs font-mono text-foreground break-all">{entry.key}</code>
                <pre className="text-xs text-muted-foreground mt-1 truncate max-w-sm">{typeof entry.value === 'object' ? JSON.stringify(entry.value) : String(entry.value)}</pre>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs px-2 py-0.5 rounded bg-info/10 text-info">{entry.type}</span>
                <span className="text-xs text-muted-foreground">{entry.ttl === -1 ? '∞' : `${entry.ttl}s`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ APIs SECTION ============
const APIsSection = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [weather, platforms] = await Promise.all([getAllZoneWeather(), getPlatformStatus()]);
    setWeatherData(weather);
    setPlatformStatus(platforms);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-success bg-success/10';
      case 'degraded': return 'text-warning bg-warning/10';
      case 'outage': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Cloud className="h-6 w-6 text-warning" /> Weather & Platform APIs
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Real-time external data feeds for trigger detection</p>
        </div>
        <Button variant="outline" onClick={loadData} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
          Refresh
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {['OpenWeatherMap API', 'Google Maps API', 'Platform Health API', 'AQI API'].map((t) => (
          <span key={t} className="text-xs px-3 py-1 rounded-full bg-warning/10 text-warning font-medium">{t}</span>
        ))}
      </div>

      {/* Weather Grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Zone Weather (Live)</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weatherData.map((w) => (
            <div key={w.zone} className={`p-4 rounded-xl bg-card border ${w.alerts.length > 0 ? 'border-destructive/50' : 'border-border'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{w.zone}</h4>
                <span className="text-xs text-muted-foreground">{w.condition}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Thermometer className="h-3.5 w-3.5 text-destructive" />
                  <span className={`font-medium ${w.temperature > 45 ? 'text-destructive' : 'text-foreground'}`}>{w.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CloudRain className="h-3.5 w-3.5 text-info" />
                  <span className={`font-medium ${w.rainfall > 40 ? 'text-destructive' : 'text-foreground'}`}>{w.rainfall} mm/hr</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-foreground">{w.windSpeed} km/h</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">AQI</span>
                  <span className={`font-medium ${w.aqi > 300 ? 'text-destructive' : w.aqi > 150 ? 'text-warning' : 'text-foreground'}`}>{w.aqi}</span>
                </div>
              </div>
              {w.alerts.length > 0 && (
                <div className="mt-3 space-y-1">
                  {w.alerts.map((a, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {a.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Platform Status */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Platform Health Monitor</h3>
        <div className="space-y-2">
          {platformStatus.map((p) => (
            <div key={p.name} className="p-3 rounded-lg bg-card border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-2.5 w-2.5 rounded-full ${
                  p.status === 'operational' ? 'bg-success' : p.status === 'degraded' ? 'bg-warning animate-pulse' : 'bg-destructive animate-pulse'
                }`} />
                <span className="font-medium text-foreground">{p.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(p.status)}`}>{p.status}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Uptime: <strong className="text-foreground">{p.uptime}%</strong></span>
                <span>Response: <strong className="text-foreground">{p.responseTime || 'N/A'}ms</strong></span>
                <span>Last incident: {p.lastIncident}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============ PAYMENTS SECTION ============
const PaymentsSection = () => {
  const [paymentResult, setPaymentResult] = useState<UPIPayment | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ workerId: 'W001', workerName: 'Ravi Kumar', amount: 450, upiId: 'ravi@upi' });

  const processPayment = async () => {
    setLoading(true);
    setPaymentResult(null);
    const result = await initiateUPIPayment(form.workerId, form.workerName, form.amount, form.upiId);
    setPaymentResult(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <IndianRupee className="h-6 w-6 text-accent" /> Mock UPI Payments
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Simulated UPI payment gateway for instant payouts</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {['UPI Gateway v2.0', 'NPCI Sandbox', 'Razorpay Mock', '92% Success Rate'].map((t) => (
          <span key={t} className="text-xs px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">{t}</span>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Send Payment */}
        <div className="p-5 rounded-xl bg-card border border-border space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Send className="h-4 w-4" /> Process Payout
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Worker</label>
              <select value={form.workerId} onChange={(e) => {
                const workers: Record<string, string> = { W001: 'Ravi Kumar', W002: 'Priya Sharma', W003: 'Amit Patel' };
                setForm(f => ({ ...f, workerId: e.target.value, workerName: workers[e.target.value] || 'Unknown' }));
              }} className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-sm">
                <option value="W001">W001 — Ravi Kumar</option>
                <option value="W002">W002 — Priya Sharma</option>
                <option value="W003">W003 — Amit Patel</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Amount (₹)</label>
              <Input type="number" value={form.amount} onChange={(e) => setForm(f => ({ ...f, amount: Number(e.target.value) }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">UPI ID</label>
              <Input value={form.upiId} onChange={(e) => setForm(f => ({ ...f, upiId: e.target.value }))} placeholder="name@upi" />
            </div>
          </div>
          <Button variant="success" className="w-full" onClick={processPayment} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <IndianRupee className="h-4 w-4" />}
            {loading ? 'Processing via UPI...' : `Pay ₹${form.amount}`}
          </Button>

          {paymentResult && (
            <div className={`p-4 rounded-lg animate-slide-in-right ${
              paymentResult.status === 'success' ? 'bg-success/10 border border-success/30' : 'bg-destructive/10 border border-destructive/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {paymentResult.status === 'success' ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-destructive" />}
                <span className="font-bold text-foreground uppercase">{paymentResult.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-muted-foreground">TXN ID:</span> <span className="font-mono text-foreground">{paymentResult.transactionId}</span></div>
                <div><span className="text-muted-foreground">Amount:</span> <span className="font-bold text-foreground">₹{paymentResult.amount}</span></div>
                <div><span className="text-muted-foreground">UPI:</span> <span className="text-foreground">{paymentResult.upiId}</span></div>
                <div><span className="text-muted-foreground">Provider:</span> <span className="text-foreground">{paymentResult.provider}</span></div>
                <div className="col-span-2"><span className="text-muted-foreground">Reference:</span> <span className="font-mono text-foreground">{paymentResult.reference}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Payment History */}
        <div className="p-5 rounded-xl bg-card border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Payment History
          </h3>
          <div className="space-y-3">
            {mockPaymentHistory.map((p) => (
              <div key={p.transactionId} className="p-3 rounded-lg bg-muted flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    {p.status === 'success' ? <CheckCircle className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
                    <span className="text-sm font-medium text-foreground">{p.workerName}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span className="font-mono">{p.transactionId}</span>
                    <span>→ {p.upiId}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">₹{p.amount}</div>
                  <div className={`text-xs capitalize ${p.status === 'success' ? 'text-success' : 'text-destructive'}`}>{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemPage;
