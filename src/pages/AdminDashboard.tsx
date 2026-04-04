import { useMemo, useState } from "react";
import { Shield, Users, AlertTriangle, TrendingUp, IndianRupee, FileText, Activity, MapPin, ChevronDown, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockAnalytics, mockWeeklyData, mockClaims, mockFraudAlerts, mockZoneData, mockTriggerEvents } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { clearAdminSession, loadAdminSession } from "@/lib/appState";

type Tab = 'overview' | 'claims' | 'triggers' | 'fraud' | 'zones';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [claims, setClaims] = useState(mockClaims);
  const navigate = useNavigate();
  const analytics = mockAnalytics;
  const adminSession = loadAdminSession();

  const claimStats = useMemo(() => {
    return claims.reduce(
      (result, claim) => {
        result.total += 1;
        result[claim.status] += 1;
        return result;
      },
      { total: 0, approved: 0, pending: 0, flagged: 0, rejected: 0 },
    );
  }, [claims]);

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'triggers', label: 'Triggers', icon: Activity },
    { id: 'fraud', label: 'Fraud', icon: AlertTriangle },
    { id: 'zones', label: 'Zones', icon: MapPin },
  ];

  const statusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <Clock className="h-4 w-4 text-warning" />;
      case 'flagged': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const riskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-destructive bg-destructive/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'low': return 'text-success bg-success/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const updateClaimStatus = (claimId: string, status: 'approved' | 'flagged' | 'rejected') => {
    setClaims((currentClaims) =>
      currentClaims.map((claim) =>
        claim.id === claimId ? { ...claim, status } : claim,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col gradient-hero p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Shield className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold text-primary-foreground">Kavro Admin</span>
        </div>
        {adminSession && (
          <div className="mb-6 rounded-xl bg-sidebar-accent px-3 py-2 text-xs text-primary-foreground/70">
            Signed in as <span className="text-primary-foreground font-medium">{adminSession.email}</span>
          </div>
        )}
        <nav className="space-y-1 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-sidebar-accent text-primary'
                  : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
        <Button
          variant="ghost"
          className="text-primary-foreground/60 hover:text-primary-foreground justify-start"
          onClick={() => {
            clearAdminSession();
            navigate('/');
          }}
        >
          ← Back to Site
        </Button>
      </div>

      {/* Mobile tabs */}
      <div className="lg:hidden sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center gap-2 p-3">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-bold text-foreground text-sm">Kavro Admin</span>
        </div>
          {adminSession && <div className="px-3 pb-2 text-xs text-muted-foreground">{adminSession.email}</div>}
        <div className="flex overflow-x-auto px-3 pb-2 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 p-4 lg:p-8">

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
              <p className="text-muted-foreground text-sm">Real-time platform analytics</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Launchpad
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              System center is available only through the direct route.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Policies', value: analytics.activePolicies.toLocaleString(), icon: Shield, color: 'text-primary bg-primary/10' },
                { label: 'Total Payouts', value: `₹${(analytics.totalPayout / 1000).toFixed(1)}K`, icon: IndianRupee, color: 'text-success bg-success/10' },
                { label: 'Loss Ratio', value: `${(analytics.lossRatio * 100).toFixed(0)}%`, icon: TrendingUp, color: 'text-warning bg-warning/10' },
                { label: 'Fraud Detection', value: `${(analytics.fraudDetectionRate * 100).toFixed(0)}%`, icon: AlertTriangle, color: 'text-destructive bg-destructive/10' },
                { label: 'Total Claims', value: claimStats.total.toLocaleString(), icon: FileText, color: 'text-info bg-info/10' },
                { label: 'Approved', value: claimStats.approved.toLocaleString(), icon: CheckCircle, color: 'text-success bg-success/10' },
                { label: 'Avg Claim Time', value: analytics.avgClaimTime, icon: Clock, color: 'text-primary bg-primary/10' },
                { label: 'Satisfaction', value: `${analytics.workerSatisfaction}/5`, icon: Users, color: 'text-accent bg-accent/10' },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-xl bg-card border border-border">
                  <div className={`h-8 w-8 rounded-lg ${stat.color} flex items-center justify-center mb-2`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div className="text-xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-4">Weekly Claims & Payouts</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockWeeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 90%)" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                    <Tooltip />
                    <Bar dataKey="claims" fill="hsl(24 95% 53%)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="payouts" fill="hsl(160 60% 45%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-4">Worker Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={mockWeeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(30 15% 90%)" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(220 10% 46%)" />
                    <Tooltip />
                    <Line type="monotone" dataKey="workers" stroke="hsl(24 95% 53%)" strokeWidth={2} dot={{ fill: 'hsl(24 95% 53%)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Claims */}
        {activeTab === 'claims' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Claims Management</h1>
              <p className="text-muted-foreground text-sm">Review and manage all claims</p>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">ID</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Worker</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Detail</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Score</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left p-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-sm font-mono text-foreground">{claim.id}</td>
                      <td className="p-3 text-sm text-foreground">{claim.workerName}</td>
                      <td className="p-3"><span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">{claim.triggerType}</span></td>
                      <td className="p-3 text-sm text-muted-foreground max-w-xs truncate">{claim.triggerDetail}</td>
                      <td className="p-3 text-sm font-semibold text-foreground">₹{claim.amount}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${claim.validationScore > 0.7 ? 'bg-success' : claim.validationScore > 0.5 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${claim.validationScore * 100}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{(claim.validationScore * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="flex items-center gap-1 text-xs font-medium capitalize">
                          {statusIcon(claim.status)}
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="success" onClick={() => updateClaimStatus(claim.id, 'approved')}>
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => updateClaimStatus(claim.id, 'flagged')}>
                            Flag
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => updateClaimStatus(claim.id, 'rejected')}>
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Triggers */}
        {activeTab === 'triggers' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Trigger Events</h1>
              <p className="text-muted-foreground text-sm">Real-time disruption monitoring</p>
            </div>
            <div className="space-y-3">
              {mockTriggerEvents.map((trigger) => (
                <div key={trigger.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${riskColor(trigger.severity)}`}>
                        {trigger.type === 'weather' ? <Activity className="h-5 w-5" /> : trigger.type === 'platform' ? <Activity className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{trigger.description}</h4>
                        <p className="text-sm text-muted-foreground mt-1">Zone: {trigger.zone}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{trigger.metric}: <strong className="text-foreground">{trigger.value}</strong> (threshold: {trigger.threshold})</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${riskColor(trigger.severity)} capitalize`}>{trigger.severity}</span>
                      <p className="text-xs text-muted-foreground mt-2">{trigger.affectedWorkers} affected</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fraud */}
        {activeTab === 'fraud' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Fraud Detection</h1>
              <p className="text-muted-foreground text-sm">AI-powered anomaly alerts</p>
            </div>
            <div className="space-y-3">
              {mockFraudAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{alert.type}</h4>
                      <p className="text-sm text-muted-foreground">{alert.workerName} ({alert.workerId})</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${riskColor(alert.riskLevel)} capitalize`}>{alert.riskLevel} risk</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {alert.signals.map((signal) => (
                      <span key={signal} className="text-xs px-2 py-1 rounded-full bg-destructive/10 text-destructive">{signal}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="destructive">Block Worker</Button>
                    <Button size="sm" variant="outline">Investigate</Button>
                    <Button size="sm" variant="ghost">Dismiss</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Zones */}
        {activeTab === 'zones' && (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Zone Management</h1>
              <p className="text-muted-foreground text-sm">Hyperlocal coverage zones</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockZoneData.map((zone) => (
                <div key={zone.zone} className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{zone.zone}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${riskColor(zone.risk)} capitalize`}>{zone.risk}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-lg font-bold text-foreground">{zone.workers}</div>
                      <div className="text-xs text-muted-foreground">Workers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{zone.claims}</div>
                      <div className="text-xs text-muted-foreground">Claims</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
