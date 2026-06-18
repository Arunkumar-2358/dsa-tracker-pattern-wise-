import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sheetsApi } from '../services/api';

export function useSheets() {
  return useQuery({
    queryKey: ['sheets'],
    queryFn: async () => {
      const res = await sheetsApi.list();
      return res.data.data;
    },
  });
}

export function useSheet(id: string) {
  return useQuery({
    queryKey: ['sheets', id],
    queryFn: async () => {
      const res = await sheetsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateSheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => sheetsApi.create(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sheets'] });
    },
  });
}

export function useUpdateSheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string } }) =>
      sheetsApi.update(id, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sheets'] });
    },
  });
}

export function useDeleteSheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => sheetsApi.delete(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sheets'] });
    },
  });
}

export function useAddProblemToSheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sheetId, problemId }: { sheetId: string; problemId: string }) =>
      sheetsApi.addProblem(sheetId, problemId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sheets'] });
    },
  });
}

export function useRemoveProblemFromSheet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sheetId, problemId }: { sheetId: string; problemId: string }) =>
      sheetsApi.removeProblem(sheetId, problemId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['sheets'] });
    },
  });
}
