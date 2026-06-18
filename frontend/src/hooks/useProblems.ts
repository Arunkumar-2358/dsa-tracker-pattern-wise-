import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { problemsApi, userProblemsApi } from '../services/api';
import type { ProblemFilters, ProblemStatus } from '../types';

export function useProblems(filters: ProblemFilters = {}) {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: async () => {
      const res = await problemsApi.list(filters);
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useProblem(id: string) {
  return useQuery({
    queryKey: ['problems', id],
    queryFn: async () => {
      const res = await problemsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useTopics() {
  return useQuery({
    queryKey: ['topics'],
    queryFn: async () => {
      const res = await problemsApi.getTopics();
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await problemsApi.getCompanies();
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateProblem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof problemsApi.create>[0]) =>
      problemsApi.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useUpdateProblem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof problemsApi.update>[1] }) =>
      problemsApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useDeleteProblem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => problemsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['problems'] });
    },
  });
}

export function useUserProblems() {
  return useQuery({
    queryKey: ['user-problems'],
    queryFn: async () => {
      const res = await userProblemsApi.getAll();
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      problemId,
      status,
      timeTaken,
      personalRating,
    }: {
      problemId: string;
      status: ProblemStatus;
      timeTaken?: number;
      personalRating?: number | null;
    }) => userProblemsApi.updateStatus(problemId, { status, timeTaken, personalRating }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['problems'] });
      void qc.invalidateQueries({ queryKey: ['user-problems'] });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useTrackClick() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (problemId: string) => userProblemsApi.trackClick(problemId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['user-problems'] });
    },
  });
}
