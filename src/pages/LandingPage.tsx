import { Shield, CloudRain, Zap, Users, TrendingUp, Clock, CheckCircle, AlertTriangle, Smartphone, MapPin, IndianRupee, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { loadWorkerSession } from "@/lib/appState";

const LandingPage = () => {
  const navigate = useNavigate();
  const workerSession = loadWorkerSession();
  const workerJourneyPath = workerSession ? "/dashboard" : "/onboarding";

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Kavro</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(workerJourneyPath)}>
              {workerSession ? "Continue" : "Sign In"}
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate(workerJourneyPath)}>
              Get Protected
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-up">
            <Zap className="h-4 w-4" />
            AI-Powered Income Protection
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Never Lose Income to{' '}
            <span className="text-gradient">Uncontrollable Events</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Automatic payouts when rain, heatwaves, or app outages stop you from earning. 
            Zero claims. Zero paperwork. Just protection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="lg" className="text-base px-8" onClick={() => navigate(workerJourneyPath)}>
              {workerSession ? "Open Worker Dashboard" : "Start Protection — ₹25/week"}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-success" /> 1,200+ workers protected</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-primary" /> Payout in &lt; 5 min</span>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="py-12 gradient-hero">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '₹1.78L', label: 'Total Payouts', icon: IndianRupee },
              { value: '1,247', label: 'Active Policies', icon: Shield },
              { value: '94%', label: 'Fraud Detection', icon: AlertTriangle },
              { value: '<5 min', label: 'Avg Claim Time', icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-sm text-primary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How Kavro Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Fully automated protection powered by real-time data and AI validation
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: CloudRain,
                title: 'Disruption Detected',
                desc: 'Our AI monitors weather, platform status, and local events in real-time across all zones.',
              },
              {
                step: '02',
                icon: Smartphone,
                title: 'Activity Verified',
                desc: 'Multi-signal validation confirms you were actively working — GPS, motion, app activity.',
              },
              {
                step: '03',
                icon: IndianRupee,
                title: 'Instant Payout',
                desc: 'Money hits your UPI account automatically. No claims, no forms, no waiting.',
              },
            ].map((item) => (
              <div key={item.step} className="relative p-6 rounded-xl border border-border bg-card hover:shadow-lg transition-all duration-300 group">
                <div className="text-5xl font-extrabold text-primary/10 absolute top-4 right-4">{item.step}</div>
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Built for Gig Workers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: CloudRain, title: 'Weather Triggers', desc: 'Rainfall >40mm/hr, temp >45°C, AQI >300 — all monitored in real-time.' },
              { icon: Zap, title: 'Platform Outage Detection', desc: 'Automatic detection of app crashes and server downtime across Zepto, Blinkit, Swiggy.' },
              { icon: MapPin, title: 'Hyperlocal Zones', desc: '2-3km geofenced zones for precise disruption mapping and coverage.' },
              { icon: Shield, title: 'Anti-Fraud AI', desc: 'Isolation Forest anomaly detection with GPS, motion, and behavioral analysis.' },
              { icon: TrendingUp, title: 'Dynamic Pricing', desc: 'Random Forest ML model adjusts premiums based on risk forecasts and history.' },
              { icon: Users, title: 'Swarm Detection', desc: 'Identifies coordinated fraud attempts using cluster analysis across workers.' },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4 p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple Weekly Plans</h2>
          <p className="text-center text-muted-foreground mb-12">Choose the coverage that fits your work</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border-2 border-border bg-card">
              <h3 className="text-xl font-bold mb-1">Base</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-foreground">₹25</span>
                <span className="text-muted-foreground">/week</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['Floods & cyclones', 'Heavy rainfall', 'Up to ₹500 payout'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" onClick={() => navigate('/onboarding')}>Choose Base</Button>
            </div>
            <div className="p-6 rounded-xl border-2 border-primary bg-card relative overflow-hidden">
              <div className="absolute top-0 right-0 gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground rounded-bl-lg">Popular</div>
              <h3 className="text-xl font-bold mb-1">Pro</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-foreground">₹55</span>
                <span className="text-muted-foreground">/week</span>
              </div>
              <ul className="space-y-3 mb-6">
                {['Everything in Base', 'Heatwave protection', 'Strike & bandh coverage', 'App crash coverage', 'Up to ₹800 payout', 'Priority validation'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button variant="hero" className="w-full" onClick={() => navigate('/onboarding')}>Choose Pro</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 gradient-hero">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary-foreground">Kavro</span>
          </div>
          <p className="text-primary-foreground/60 text-sm mb-6">
            Transforming income uncertainty into financial security for India's gig workforce.
          </p>
          <p className="text-primary-foreground/40 text-xs">© 2024 Kavro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
