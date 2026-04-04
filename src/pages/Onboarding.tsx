import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowRight, ArrowLeft, CheckCircle, MapPin, Smartphone, Zap, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { platforms, plans, mockWorker } from "@/data/mockData";
import { calculatePremiumML, type PricingResult } from "@/services/aiEngine";
import { initiateUPIPayment } from "@/services/payments";
import { loadWorkerSession, saveWorkerSession } from "@/lib/appState";

type Step = 'profile' | 'otp' | 'platform' | 'zone' | 'plan' | 'review' | 'done';

const flowSteps: Step[] = ['profile', 'otp', 'platform', 'zone', 'plan', 'review', 'done'];

const zoneRiskForecast: Record<string, number> = {
  Koramangala: 0.6,
  "HSR Layout": 0.3,
  Indiranagar: 0.8,
  Whitefield: 0.5,
  "JP Nagar": 0.2,
  "Electronic City": 0.7,
};

const coverageByPlan: Record<'base' | 'pro', string[]> = {
  base: ['Floods', 'Heavy Rain', 'Auto payout up to policy limit'],
  pro: ['Heavy Rain', 'Heatwave', 'App Outage', 'Strike', 'Priority validation'],
};

const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get('mode') === 'edit';
  const currentSession = useMemo(() => loadWorkerSession(), []);
  const [step, setStep] = useState<Step>(isEditing ? 'platform' : 'profile');
  const [fullName, setFullName] = useState(currentSession?.workerName || mockWorker.name);
  const [phone, setPhone] = useState(currentSession?.phone || '');
  const [otp, setOtp] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState(currentSession?.platform || '');
  const [selectedZone, setSelectedZone] = useState(currentSession?.zone || '');
  const [selectedPlan, setSelectedPlan] = useState<'base' | 'pro' | ''>(currentSession?.plan || '');
  const [upiId, setUpiId] = useState(currentSession?.upiId || '');
  const [activationState, setActivationState] = useState<'idle' | 'processing' | 'failed' | 'success'>('idle');
  const [activationMessage, setActivationMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();

  const zones = ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'JP Nagar', 'Electronic City'];

  const activeSteps = useMemo(() => {
    return isEditing ? (['platform', 'zone', 'plan', 'review', 'done'] as Step[]) : flowSteps;
  }, [isEditing]);

  useEffect(() => {
    if (!isEditing && currentSession) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentSession, isEditing, navigate]);

  const quote: PricingResult | null = useMemo(() => {
    if (!selectedPlan || !selectedZone) {
      return null;
    }

    return calculatePremiumML({
      plan: selectedPlan,
      zone: selectedZone,
      reliabilityScore: currentSession?.reliabilityScore ?? mockWorker.reliabilityScore,
      claimHistory: currentSession ? 1 : 0,
      weatherForecast: zoneRiskForecast[selectedZone] ?? 0.5,
    });
  }, [currentSession, selectedPlan, selectedZone]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((currentValue) => Math.max(0, currentValue - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendCountdown]);

  const stepIndex = activeSteps.indexOf(step);
  const progress = (stepIndex / Math.max(1, activeSteps.length - 1)) * 100;

  const digitsOnlyPhone = phone.replace(/\D/g, '');
  const canContinueProfile = fullName.trim().length > 1 && digitsOnlyPhone.length >= 10;
  const canVerifyOtp = otp.replace(/\D/g, '').length === 4;
  const workerName = fullName.trim() || currentSession?.workerName || mockWorker.name;
  const workerId = currentSession?.workerId || mockWorker.id;
  const planCoverage = selectedPlan ? coverageByPlan[selectedPlan] : currentSession?.coverage || [];
  const finalPremium = quote?.finalPremium ?? (selectedPlan === 'pro' ? 55 : 25);
  const maxPayout = selectedPlan === 'pro' ? 800 : 500;
  const policyStart = new Date().toISOString().slice(0, 10);
  const policyEndDate = new Date();
  policyEndDate.setDate(policyEndDate.getDate() + 6);
  const policyEnd = policyEndDate.toISOString().slice(0, 10);

  const handleResendOtp = () => {
    setResendCountdown(30);
    setActivationMessage(`OTP resent to +91 ${phone}`);
  };

  const nextStep = () => {
    const idx = activeSteps.indexOf(step);
    if (idx < activeSteps.length - 1) {
      setStep(activeSteps[idx + 1]);
    }
  };

  const prevStep = () => {
    const idx = activeSteps.indexOf(step);
    if (idx > 0) setStep(activeSteps[idx - 1]);
  };

  const activateCoverage = async () => {
    if (!selectedPlan || !selectedPlatform || !selectedZone || !upiId.trim()) {
      setActivationState('failed');
      setActivationMessage('Add your UPI ID and complete the plan details before activating coverage.');
      return;
    }

    setActivationState('processing');
    setActivationMessage('Processing UPI payment and activating your policy...');

    const payment = await initiateUPIPayment(workerId, workerName, finalPremium, upiId.trim());

    if (payment.status !== 'success') {
      setActivationState('failed');
      setActivationMessage('Payment failed. Try another UPI ID or retry in a moment.');
      return;
    }

    saveWorkerSession({
      workerId,
      workerName,
      phone,
      platform: selectedPlatform,
      zone: selectedZone,
      plan: selectedPlan,
      premium: finalPremium,
      maxPayout,
      coverage: planCoverage,
      policyId: currentSession?.policyId || `POL-${Date.now().toString(36).toUpperCase()}`,
      policyStart,
      policyEnd,
      reliabilityScore: currentSession?.reliabilityScore || mockWorker.reliabilityScore,
      upiId: upiId.trim(),
      paymentReference: payment.reference,
      paymentStatus: payment.status,
      activatedAt: payment.timestamp,
    });

    setActivationState('success');
    setActivationMessage(`Coverage activated successfully. Reference ${payment.reference}.`);
    setStep('done');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        {step !== 'done' && !(isEditing && step === 'platform') && (
          <button onClick={prevStep} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
        )}
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">Kavro</span>
        </div>
        {isEditing && (
          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            Editing active coverage
          </span>
        )}
      </div>

      {/* Progress */}
      {step !== 'done' && (
        <div className="px-4 mb-8">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex-1 flex items-start justify-center px-4 pt-8">
        <div className="w-full max-w-md">

          {/* Phone */}
          {!isEditing && step === 'profile' && (
            <div className="animate-fade-in-up">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                <Smartphone className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Set up your account</h2>
              <p className="text-muted-foreground mb-6">We use your name and mobile number to personalize your policy</p>
              <div className="space-y-4 mb-6">
                <Input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-lg"
                />
                <div className="flex gap-2">
                  <div className="px-4 py-3 bg-muted rounded-lg text-sm font-medium text-foreground">+91</div>
                <Input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-lg"
                />
                </div>
              </div>
              <Button variant="hero" className="w-full" size="lg" onClick={nextStep} disabled={!canContinueProfile}>
                Send OTP <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* OTP */}
          {!isEditing && step === 'otp' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Verify OTP</h2>
              <p className="text-muted-foreground mb-6">Enter the 4-digit code sent to +91 {phone}</p>
              <div className="flex gap-3 justify-center mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <Input
                    key={i}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 text-center text-2xl font-bold"
                    value={otp[i] || ''}
                    onChange={(e) => {
                      const newOtp = otp.split('');
                      newOtp[i] = e.target.value;
                      setOtp(newOtp.join(''));
                      if (e.target.value && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <Button variant="hero" className="w-full" size="lg" onClick={nextStep} disabled={!canVerifyOtp}>
                Verify <ArrowRight className="h-5 w-5" />
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Didn't receive?{' '}
                <button className="text-primary font-medium" onClick={handleResendOtp} disabled={resendCountdown > 0}>
                  {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend'}
                </button>
              </p>
            </div>
          )}

          {/* Platform */}
          {step === 'platform' && (
            <div className="animate-fade-in-up">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Select your platform</h2>
              <p className="text-muted-foreground mb-6">Which delivery platform do you work with?</p>
              <div className="space-y-3 mb-6">
                {platforms.map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPlatform(p)}
                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                      selectedPlatform === p
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/30'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button variant="hero" className="w-full" size="lg" onClick={nextStep} disabled={!selectedPlatform}>
                Continue <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Zone */}
          {step === 'zone' && (
            <div className="animate-fade-in-up">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                <MapPin className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Your work zone</h2>
              <p className="text-muted-foreground mb-6">Select or auto-detect your delivery area</p>
              <Button variant="outline" className="w-full mb-4" onClick={() => setSelectedZone('Koramangala')}>
                <MapPin className="h-4 w-4" /> Auto-detect my zone
              </Button>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {zones.map((z) => (
                  <button
                    key={z}
                    onClick={() => setSelectedZone(z)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedZone === z
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary/30'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
              <Button variant="hero" className="w-full" size="lg" onClick={nextStep} disabled={!selectedZone}>
                Continue <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Plan */}
          {step === 'plan' && (
            <div className="animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-2 text-foreground">Choose your plan</h2>
              <p className="text-muted-foreground mb-6">Weekly coverage that auto-renews</p>
              <div className="space-y-4 mb-6">
                {(['base', 'pro'] as const).map((planKey) => {
                  const plan = plans[planKey];
                  return (
                    <button
                      key={planKey}
                      onClick={() => setSelectedPlan(planKey)}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                        selectedPlan === planKey
                          ? 'border-primary bg-primary/5'
                          : 'border-border bg-card hover:border-primary/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="font-bold text-lg text-foreground">{plan.name}</span>
                          {planKey === 'pro' && (
                            <span className="ml-2 text-xs gradient-primary text-primary-foreground px-2 py-0.5 rounded-full">Recommended</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-2xl font-extrabold text-foreground">₹{plan.price}</span>
                          <span className="text-sm text-muted-foreground">/week</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.coverage.map((c) => (
                          <span key={c} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{c}</span>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Max payout: ₹{plan.maxPayout}/event</p>
                    </button>
                  );
                })}
              </div>
              {quote && (
                <div className="p-4 rounded-xl bg-muted mb-6 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Personalized premium</span>
                    <span className="font-semibold text-foreground">₹{quote.finalPremium}/week</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Risk factor</span>
                    <span className="font-semibold text-foreground">{quote.riskFactor}x</span>
                  </div>
                </div>
              )}
              <Button variant="hero" className="w-full" size="lg" onClick={nextStep} disabled={!selectedPlan}>
                Review coverage <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Review */}
          {step === 'review' && (
            <div className="animate-fade-in-up">
              <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                <CreditCard className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Review and activate</h2>
              <p className="text-muted-foreground mb-6">Confirm your details before we create the policy and process the premium</p>
              <div className="p-4 rounded-xl bg-card border border-border mb-6 space-y-3">
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Name</span><span className="font-medium text-foreground">{workerName}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Phone</span><span className="font-medium text-foreground">+91 {phone}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Platform</span><span className="font-medium text-foreground">{selectedPlatform}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Zone</span><span className="font-medium text-foreground">{selectedZone}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Plan</span><span className="font-medium text-foreground capitalize">{selectedPlan}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Premium</span><span className="font-medium text-foreground">₹{finalPremium}/week</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">UPI ID</span><span className="font-medium text-foreground">{upiId || 'Add below'}</span></div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">UPI ID for payouts</label>
                <Input
                  type="text"
                  placeholder="name@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
              {activationMessage && (
                <div className={`p-3 rounded-lg mb-4 text-sm ${activationState === 'failed' ? 'bg-destructive/10 text-destructive' : activationState === 'success' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                  {activationMessage}
                </div>
              )}
              <div className="space-y-3 mb-6">
                <Button variant="hero" className="w-full" size="lg" onClick={activateCoverage} disabled={activationState === 'processing'}>
                  {activationState === 'processing' ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                  {activationState === 'processing' ? 'Activating...' : 'Activate Coverage'}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => setStep('plan')}>
                  Back to plan
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Your policy activates only after the simulated UPI payment succeeds.</p>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="animate-fade-in-up text-center pt-8">
              <div className="h-20 w-20 rounded-full gradient-success flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                <CheckCircle className="h-10 w-10 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">You're Protected! 🎉</h2>
              <p className="text-muted-foreground mb-2">
                {selectedPlan === 'pro' ? 'Pro' : 'Base'} coverage is now active for {selectedZone}
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                Working on {selectedPlatform} • Auto-renews weekly
              </p>
              <div className="p-4 rounded-xl bg-muted mb-6">
                <div className="text-sm text-muted-foreground mb-1">Weekly Premium</div>
                <div className="text-2xl font-bold text-foreground">₹{finalPremium}</div>
              </div>
              {activationMessage && (
                <div className="p-3 rounded-lg bg-success/10 text-success text-sm mb-6">
                  {activationMessage}
                </div>
              )}
              <Button variant="hero" className="w-full" size="lg" onClick={() => navigate('/dashboard')}>
                Go to Dashboard <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
