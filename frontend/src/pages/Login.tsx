import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Code2, ExternalLink, Loader2, Phone, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

export function Login() {
  const { token, setToken, setUser } = useAuthStore();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRequestOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await authApi.requestOtp(phone);
      setNormalizedPhone(res.data.data.phone);
      setDevOtp(res.data.data.devOtp ?? '');
      setStep('otp');
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message ?? 'Could not send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await authApi.verifyOtp(normalizedPhone || phone, otp);
      setToken(res.data.data.token);
      setUser(res.data.data.user);
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(message ?? 'Could not verify OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8 text-center">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Code2 className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">DSA Tracker</h1>
          <p className="text-muted-foreground">
            Your personal FAANG preparation tracker.
            <br />
            Track every problem, master every pattern.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            '300+ Problems',
            'Pattern-wise',
            'Roadmaps',
            'Streak Tracking',
            'Analytics',
          ].map((f) => (
            <span
              key={f}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {f}
            </span>
          ))}
        </div>

        {step === 'phone' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-11 pl-9"
                  placeholder="+91 98765 43210"
                  required
                />
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full gap-2 h-11" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="otp">OTP</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                className="h-11 text-center text-lg tracking-[0.35em]"
                placeholder="123456"
                required
              />
            </div>
            {devOtp && (
              <p className="rounded-md border border-border bg-muted px-3 py-2 text-center text-sm text-muted-foreground">
                Local OTP: <span className="font-semibold text-foreground">{devOtp}</span>
              </p>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button className="w-full gap-2 h-11" size="lg" disabled={isSubmitting || otp.length !== 6}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Verify OTP
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
            >
              Change phone number
            </Button>
          </form>
        )}

        {/* Footer */}
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          Problems redirect to
          <a
            href="https://leetcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-primary hover:underline"
          >
            LeetCode <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </div>
  );
}
