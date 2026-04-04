import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Mail, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAllowlist, isAllowedAdminEmail, loadAdminSession, saveAdminSession } from "@/lib/appState";

const AdminAccess = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState(adminAllowlist[0]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadAdminSession()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleAccess = () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isAllowedAdminEmail(normalizedEmail)) {
      setError("This email is not on the admin allowlist.");
      return;
    }

    saveAdminSession(normalizedEmail);
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-8 rounded-3xl gradient-hero text-primary-foreground shadow-2xl">
          <div className="h-14 w-14 rounded-2xl bg-sidebar-accent flex items-center justify-center mb-6">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <p className="text-sm text-primary-foreground/70 mb-2">Admin access</p>
          <h1 className="text-3xl font-bold mb-4">Operational control for Kavro admins</h1>
          <p className="text-primary-foreground/70 mb-6 max-w-md">
            Sign in with an approved admin email to review claims, monitor fraud, and open the system center.
          </p>
          <div className="space-y-2 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2"><LockKeyhole className="h-4 w-4" /> Allowlisted access only</div>
            <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> No passwordless backdoor flows</div>
            <div className="flex items-center gap-2"><ArrowRight className="h-4 w-4" /> Dashboard and system access are separated from the worker flow</div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-card border border-border shadow-xl">
          <h2 className="text-2xl font-bold text-foreground mb-2">Enter admin email</h2>
          <p className="text-sm text-muted-foreground mb-6">Use one of the approved addresses to continue.</p>
          <div className="space-y-4">
            <Input
              type="email"
              autoComplete="email"
              placeholder="admin@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full" variant="hero" size="lg" onClick={handleAccess}>
              Continue to Admin Dashboard
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate("/")}>Back to Launchpad</Button>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Approved emails</p>
            <div className="flex flex-wrap gap-2">
              {adminAllowlist.slice(0, 8).map((item) => (
                <button
                  key={item}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setEmail(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;