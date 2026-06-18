import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { user, token, isAuthenticated, setUser, setToken, logout } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Capture token from OAuth redirect
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, setToken, navigate]);

  const { isLoading, error } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.getMe();
      setUser(res.data.data as typeof user & NonNullable<typeof user>);
      return res.data.data;
    },
    enabled: !!token && !user,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      logout();
      navigate('/login');
    }
  };

  return { user, token, isAuthenticated, isLoading, error, logout: handleLogout };
}
