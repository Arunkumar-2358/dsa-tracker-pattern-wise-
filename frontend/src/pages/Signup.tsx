import { Navigate } from 'react-router-dom';
import { AuthShell } from '@/components/auth/AuthShell';
import { PhoneAuthForm } from '@/components/auth/PhoneAuthForm';
import { useAuthStore } from '@/store/authStore';

export function Signup() {
  const { token } = useAuthStore();
  if (token) return <Navigate to="/dashboard" replace />;

  return (
    <AuthShell
      title="Create your account"
      subtitle="Track every problem, master every pattern."
    >
      <PhoneAuthForm mode="signup" />
    </AuthShell>
  );
}
