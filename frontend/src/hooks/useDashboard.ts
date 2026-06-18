import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../services/api';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await dashboardApi.get();
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}
