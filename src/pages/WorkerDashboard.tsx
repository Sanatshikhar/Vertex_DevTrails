import { Shield, Clock, TrendingUp, CheckCircle, AlertTriangle, IndianRupee, CloudRain, Zap, Users, ChevronRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockWorker, mockPolicies, mockClaims, mockTriggerEvents } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { clearWorkerSession, loadWorkerSession } from "@/lib/appState";
import { mockPaymentHistory } from "@/services/payments";

const WorkerDashboard = () => {
  const navigate = useNavigate();
  const workerSession = loadWorkerSession();
  const worker = workerSession
    ? {
        ...mockWorker,
        id: workerSession.workerId,
        name: workerSession.workerName,
        phone: workerSession.phone,
        platform: workerSession.platform,
        zone: workerSession.zone,
        plan: workerSession.plan,
        reliabilityScore: workerSession.reliabilityScore,
        activeSince: workerSession.activatedAt,
        status: 'active' as const,
      }
    : mockWorker;

  const activePolicy = workerSession
    ? {
        id: workerSession.policyId,
        workerId: workerSession.workerId,
        plan: workerSession.plan,
        startDate: workerSession.policyStart,
        endDate: workerSession.policyEnd,
        premium: workerSession.premium,
        maxPayout: workerSession.maxPayout,
        status: 'active' as const,
        triggers: workerSession.coverage,
        zone: workerSession.zone,
      }
    : mockPolicies.find((policy) => policy.status === 'active');

  const workerClaims = mockClaims.filter((claim) => claim.workerId === worker.id);
  const paymentHistory = mockPaymentHistory.filter((payment) => payment.workerId === worker.id || payment.workerName === worker.name);
  const recentTriggers = mockTriggerEvents.slice(0, 3);

  const triggerIcon = (type: string) => {
    switch (type) {
      case 'weather': return <CloudRain className="h-4 w-4" />;
      case 'platform': return <Zap className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10';
      case 'pending': return 'text-warning bg-warning/10';
      case 'flagged': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive bg-destructive/10';
      case 'high': return 'text-primary bg-primary/10';
      case 'medium': return 'text-warning bg-warning/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="gradient-hero px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary-foreground">Kavro</span>
          </div>
          <button
            className="p-2 rounded-lg bg-sidebar-accent"
            onClick={() => {
              clearWorkerSession();
              navigate('/');
            }}
          >
            <Settings className="h-5 w-5 text-primary-foreground" />
          </button>
        </div>
        <p className="text-primary-foreground/70 text-sm">Welcome back,</p>
        <h1 className="text-2xl font-bold text-primary-foreground">{worker.name}</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">{worker.platform}</span>
          <span className="text-xs text-primary-foreground/60">{worker.zone}</span>
          {workerSession && <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-primary-foreground">Live session</span>}
        </div>
      </div>

      <div className="px-4 -mt-4 space-y-4">
        {activePolicy && (
          <div id="policy-summary" className="p-5 rounded-xl bg-card border border-border shadow-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Active Coverage</span>
              <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                <CheckCircle className="h-3 w-3" /> Active
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-extrabold text-foreground">{activePolicy.plan === 'pro' ? 'Pro' : 'Base'}</span>
              <span className="text-sm text-muted-foreground">Plan</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{activePolicy.startDate} — {activePolicy.endDate}</p>
            <div className="flex flex-wrap gap-1.5">
              {activePolicy.triggers.map((trigger) => (
                <span key={trigger} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{trigger}</span>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
              <span className="text-muted-foreground">Max payout</span>
              <span className="font-semibold text-foreground">₹{activePolicy.maxPayout}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <IndianRupee className="h-5 w-5 text-primary mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">₹{worker.totalProtected.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Protected</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <TrendingUp className="h-5 w-5 text-success mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">{worker.reliabilityScore}%</div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border text-center">
            <Clock className="h-5 w-5 text-info mx-auto mb-1" />
            <div className="text-lg font-bold text-foreground">₹{worker.weeklyEarnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" /> Live Triggers
          </h3>
          <div className="space-y-2">
            {recentTriggers.map((trigger) => (
              <div key={trigger.id} className="p-3 rounded-lg bg-card border border-border flex items-start gap-3">
                <div className={`p-2 rounded-lg ${severityColor(trigger.severity)}`}>
                  {triggerIcon(trigger.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{trigger.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{trigger.zone}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${severityColor(trigger.severity)}`}>{trigger.severity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Claims</h3>
          <div className="space-y-2">
            {workerClaims.length > 0 ? workerClaims.map((claim) => (
              <div key={claim.id} className="p-3 rounded-lg bg-card border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusColor(claim.status)}`}>
                    {triggerIcon(claim.triggerType)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{claim.triggerDetail.split(':')[0]}</p>
                    <p className="text-xs text-muted-foreground">{new Date(claim.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">₹{claim.amount}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColor(claim.status)}`}>{claim.status}</span>
                </div>
              </div>
            )) : (
              <div className="p-6 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground">No claims yet — you're fully covered!</p>
              </div>
            )}
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="space-y-2">
            {[
              { label: worker.plan === 'pro' ? 'Manage Coverage' : 'Upgrade to Pro', desc: worker.plan === 'pro' ? 'Change policy details' : 'Get full coverage', action: () => navigate('/onboarding?mode=edit') },
              { label: 'View Policy Details', desc: activePolicy?.id || 'Open policy summary', action: () => document.getElementById('policy-summary')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
              { label: 'Payment History', desc: 'All transactions', action: () => document.getElementById('payment-history')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) },
            ].map((item) => (
              <button key={item.label} className="w-full p-4 rounded-xl bg-card border border-border flex items-center justify-between hover:border-primary/30 transition-colors" onClick={item.action}>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>

        <div id="payment-history" className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="text-sm font-semibold text-foreground mb-3">Payment History</h3>
          <div className="space-y-2">
            {paymentHistory.length > 0 ? paymentHistory.map((payment) => (
              <div key={payment.transactionId} className="p-3 rounded-lg bg-card border border-border flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{payment.provider}</p>
                  <p className="text-xs text-muted-foreground">{payment.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">₹{payment.amount}</p>
                  <p className={`text-xs capitalize ${payment.status === 'success' ? 'text-success' : 'text-destructive'}`}>{payment.status}</p>
                </div>
              </div>
            )) : (
              <div className="p-6 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground">No payouts yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
