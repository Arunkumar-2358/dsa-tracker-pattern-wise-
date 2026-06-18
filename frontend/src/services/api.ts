import axios from 'axios';
import type {
  Problem,
  UserProblem,
  Roadmap,
  DashboardData,
  ProblemFilters,
  ProblemStatus,
  ApiResponse,
  PaginatedResponse,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  getMe: () =>
    api.get<ApiResponse<{ id: string; email: string; name: string; avatar: string | null; streak: number }>>(
      '/auth/me'
    ),
  requestOtp: (phone: string) =>
    api.post<ApiResponse<{ phone: string; devOtp?: string }>>('/auth/request-otp', { phone }),
  verifyOtp: (phone: string, otp: string) =>
    api.post<ApiResponse<{ token: string; user: { id: string; email: string; name: string; avatar: string | null; streak: number } }>>(
      '/auth/verify-otp',
      { phone, otp }
    ),
  logout: () => api.post<ApiResponse<null>>('/auth/logout'),
};

// ─── Problems ────────────────────────────────────────────────────────────────

export const problemsApi = {
  list: (filters: ProblemFilters = {}) =>
    api.get<PaginatedResponse<Problem[]>>('/problems', { params: filters }),

  getById: (id: string) => api.get<ApiResponse<Problem>>(`/problems/${id}`),

  create: (data: Partial<Problem>) => api.post<ApiResponse<Problem>>('/problems', data),

  update: (id: string, data: Partial<Problem>) =>
    api.patch<ApiResponse<Problem>>(`/problems/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/problems/${id}`),

  getTopics: () => api.get<ApiResponse<Array<{ topic: string; phase: string }>>>('/problems/topics'),

  getCompanies: () => api.get<ApiResponse<string[]>>('/problems/companies'),
};

// ─── User Problems ───────────────────────────────────────────────────────────

export const userProblemsApi = {
  getAll: () => api.get<ApiResponse<UserProblem[]>>('/user-problems'),

  get: (problemId: string) =>
    api.get<ApiResponse<UserProblem | null>>(`/user-problems/${problemId}`),

  updateStatus: (
    problemId: string,
    data: { status: ProblemStatus; timeTaken?: number; personalRating?: number | null }
  ) => api.patch<ApiResponse<UserProblem>>(`/user-problems/${problemId}/status`, data),

  trackClick: (problemId: string) =>
    api.post<ApiResponse<UserProblem>>(`/user-problems/${problemId}/click`),
};

// ─── Roadmaps ────────────────────────────────────────────────────────────────

export const roadmapsApi = {
  list: () => api.get<ApiResponse<Roadmap[]>>('/roadmaps'),

  getById: (id: string) => api.get<ApiResponse<Roadmap>>(`/roadmaps/${id}`),

  create: (data: { name: string; description?: string }) =>
    api.post<ApiResponse<Roadmap>>('/roadmaps', data),

  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch<ApiResponse<null>>(`/roadmaps/${id}`, data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/roadmaps/${id}`),

  addNode: (roadmapId: string, data: { topic: string; parentId?: string | null }) =>
    api.post<ApiResponse<{ id: string }>>(`/roadmaps/${roadmapId}/nodes`, data),

  deleteNode: (roadmapId: string, nodeId: string) =>
    api.delete<ApiResponse<null>>(`/roadmaps/${roadmapId}/nodes/${nodeId}`),
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const dashboardApi = {
  get: () => api.get<ApiResponse<DashboardData>>('/dashboard'),
  getHeatmap: (days?: number) =>
    api.get<ApiResponse<Array<{ date: string; count: number }>>>('/dashboard/heatmap', {
      params: { days },
    }),
};
