import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from 'firebase/auth';
import { Loader2, Phone, ShieldCheck, User as UserIcon } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'signup' | 'signin';

function friendlyError(err: unknown): string {
  if (typeof err === 'object' && err) {
    // Firebase errors carry a `code`; backend errors carry response.data.error
    const code = (err as { code?: string }).code;
    // Surface the raw error so issues are debuggable from the console.
    console.error('Auth error:', code ?? err, err);
    if (code === 'auth/invalid-phone-number') return 'That phone number looks invalid. Include your country code, e.g. +91…';
    if (code === 'auth/too-many-requests') return 'Too many attempts. Please wait a few minutes and try again.';
    if (code === 'auth/invalid-verification-code') return 'Incorrect code. Please check and try again.';
    if (code === 'auth/code-expired') return 'That code expired. Request a new one.';
    if (code === 'auth/operation-not-allowed') return 'Phone sign-in is not enabled in Firebase yet.';
    if (code === 'auth/unauthorized-domain') return 'This domain is not authorized in Firebase Authentication settings.';
    if (code === 'auth/invalid-app-credential') return 'reCAPTCHA/app verification failed — usually an unauthorized domain or restricted API key.';
    if (code === 'auth/billing-not-enabled') return 'Firebase requires the Blaze (pay-as-you-go) plan for phone auth.';
    const apiMsg = (err as { response?: { data?: { error?: string } } }).response?.data?.error;
    if (apiMsg) return apiMsg;
    if (code) return `Couldn't send the code (${code}).`;
  }
  return 'Something went wrong. Please try again.';
}

export function PhoneAuthForm({ mode }: { mode: Mode }) {
  const { setToken, setUser } = useAuthStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);

  const getRecaptcha = (): RecaptchaVerifier => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
    return recaptchaRef.current;
  };

  const resetRecaptcha = () => {
    recaptchaRef.current?.clear();
    recaptchaRef.current = null;
  };

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const e164 = phone.replace(/[^\d+]/g, '');
    if (!/^\+\d{8,15}$/.test(e164)) {
      setError('Enter your number with country code, e.g. +91 98765 43210');
      return;
    }
    if (mode === 'signup' && name.trim().length < 1) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      confirmationRef.current = await signInWithPhoneNumber(auth, e164, getRecaptcha());
      setStep('otp');
    } catch (err) {
      resetRecaptcha();
      setError(friendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!confirmationRef.current) {
      setError('Please request a code first.');
      setStep('phone');
      return;
    }

    setIsSubmitting(true);
    try {
      const cred = await confirmationRef.current.confirm(otp);
      const idToken = await cred.user.getIdToken();
      const res = await authApi.firebase(idToken, mode, name.trim() || undefined);
      // We use our own session token; the Firebase session is no longer needed.
      await signOut(auth).catch(() => {});
      setToken(res.data.data.token);
      setUser(res.data.data.user);
    } catch (err) {
      setError(friendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {step === 'phone' ? (
        <form onSubmit={handleSendOtp} className="space-y-4 text-left">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 pl-9"
                  placeholder="Arun"
                  required
                />
              </div>
            </div>
          )}
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
                onChange={(e) => setPhone(e.target.value)}
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
            <Label htmlFor="otp">Enter the 6-digit code sent to {phone}</Label>
            <Input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-11 text-center text-lg tracking-[0.35em]"
              placeholder="123456"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button className="w-full gap-2 h-11" size="lg" disabled={isSubmitting || otp.length !== 6}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Verify & continue
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError('');
              resetRecaptcha();
            }}
          >
            Change phone number
          </Button>
        </form>
      )}

      <p className="text-sm text-muted-foreground">
        {mode === 'signup' ? (
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </>
        )}
      </p>

      {/* Invisible reCAPTCHA mounts here (required by Firebase phone auth) */}
      <div id="recaptcha-container" />
    </>
  );
}
